import json
from datetime import datetime, timezone
from transformers import pipeline
from database.client import redis_client

MODEL_NAME = "ProsusAI/finbert"
_pipe = None

def get_sentiment_pipeline():
    """Lazy-load Hugging Face FinBERT pipeline on demand."""
    global _pipe
    if _pipe is None:
        try:
            from transformers import pipeline
            print("[SentimentService] Loading Hugging Face FinBERT model...")
            _pipe = pipeline(
                "text-classification",
                model=MODEL_NAME,
                tokenizer=MODEL_NAME,
                top_k=None
            )
            print("[SentimentService] FinBERT model loaded successfully.")
        except Exception as e:
            print(f"[SentimentService] Warning: FinBERT pipeline initialization failed: {e}. Using fallback lexicon.")
            _pipe = "FALLBACK"
    return _pipe


def analyze(headline: str, summary: str = "") -> dict:
    """
    Step 2 & 4: Analyzes article text using FinBERT (or rule-based fallback) and returns label, confidence,
    and normalized sentiment score in [-1.0, +1.0] range.
    """
    text = f"{headline} - {summary}".strip() if summary else headline.strip()
    pipe = get_sentiment_pipeline()

    if pipe is not None and pipe != "FALLBACK":
        try:
            results = pipe(text)[0]  # returns list of dicts [{'label': 'positive', 'score': 0.85}, ...]
            scores = {item["label"].lower(): item["score"] for item in results}
            pos = scores.get("positive", 0.0)
            neg = scores.get("negative", 0.0)
            neu = scores.get("neutral", 0.0)

            # Step 4 - Normalize Score: P_pos - P_neg (yields continuous range [-1.0, +1.0])
            normalized_score = round(pos - neg, 4)

            # Dominant classification & confidence
            dominant_label = max(scores, key=scores.get)
            confidence = round(scores[dominant_label], 4)

            return {
                "label": dominant_label,
                "score": normalized_score,
                "confidence": confidence,
                "breakdown": {
                    "positive": round(pos, 4),
                    "negative": round(neg, 4),
                    "neutral": round(neu, 4)
                }
            }
        except Exception as e:
            print(f"[SentimentService] FinBERT inference exception: {e}. Falling back to lexicon analysis.")

    # Rule-based financial keyword sentiment fallback
    lower_text = text.lower()
    pos_words = ["surge", "jump", "record", "gain", "beat", "positive", "growth", "high", "soar", "profit", "bull", "up", "exceed", "top", "unveils", "expands"]
    neg_words = ["drop", "fall", "loss", "miss", "negative", "decline", "low", "plunge", "down", "layoff", "cut", "risk", "warning", "fail", "lawsuit", "investigation"]

    pos_count = sum(1 for w in pos_words if w in lower_text)
    neg_count = sum(1 for w in neg_words if w in lower_text)

    if pos_count > neg_count:
        label = "positive"
        score = min(0.35 + 0.15 * (pos_count - neg_count), 0.95)
    elif neg_count > pos_count:
        label = "negative"
        score = max(-0.35 - 0.15 * (neg_count - pos_count), -0.95)
    else:
        label = "neutral"
        score = 0.0

    score = round(score, 4)
    conf = 0.75 if label != "neutral" else 0.50

    return {
        "label": label,
        "score": score,
        "confidence": conf,
        "breakdown": {
            "positive": round(max(0.0, score), 4),
            "negative": round(abs(min(0.0, score)), 4),
            "neutral": round(1.0 - abs(score), 4)
        }
    }


def update_stock_sentiment(ticker: str, new_score: float, new_confidence: float) -> dict:
    """
    Step 6 & 7: Updates stock Hash in Redis ('stock:{TICKER}') using running average math.
    Calculates running sentiment average and confidence, updates article_count, and last_updated timestamp.
    """
    ticker = ticker.upper()
    hash_key = f"stock:{ticker}"

    # Fetch existing Redis Hash fields
    existing = redis_client.hgetall(hash_key) or {}
    if isinstance(existing, str) or not isinstance(existing, dict):
        existing = {}

    try:
        old_sentiment = float(existing.get("sentiment", 0.0))
    except (ValueError, TypeError):
        old_sentiment = 0.0

    try:
        old_confidence = float(existing.get("confidence", 0.0))
    except (ValueError, TypeError):
        old_confidence = 0.0

    try:
        old_count = int(existing.get("article_count", 0))
    except (ValueError, TypeError):
        old_count = 0

    # Step 7 - Running Sentiment & Decay Math
    if old_count == 0:
        new_count = 1
        running_sentiment = new_score
        running_confidence = new_confidence
    else:
        # Cap count window at 20 so old news gradually decays
        weight = min(old_count, 20)
        running_sentiment = ((old_sentiment * weight) + new_score) / (weight + 1)
        running_confidence = ((old_confidence * weight) + new_confidence) / (weight + 1)
        new_count = old_count + 1

    running_sentiment = round(running_sentiment, 4)
    running_confidence = round(running_confidence, 4)
    now_iso = datetime.now(timezone.utc).isoformat()

    # Step 6 - Store in Redis Hash
    redis_client.hset(hash_key, "sentiment", str(running_sentiment))
    redis_client.hset(hash_key, "confidence", str(running_confidence))
    redis_client.hset(hash_key, "article_count", str(new_count))
    redis_client.hset(hash_key, "last_updated", now_iso)

    # Initialize default price/volume if not set
    if not redis_client.hget(hash_key, "price"):
        redis_client.hset(hash_key, "price", "0.00")
    if not redis_client.hget(hash_key, "volume"):
        redis_client.hset(hash_key, "volume", "0")

    return {
        "ticker": ticker,
        "sentiment": running_sentiment,
        "confidence": running_confidence,
        "article_count": new_count,
        "last_updated": now_iso
    }


def save_enriched_article(ticker: str, article_data: dict) -> None:
    """
    Step 6: Pushes enriched article object into Redis List 'recent_news:{TICKER}'
    and trims list to retain top 50 items using LTRIM.
    """
    ticker = ticker.upper()
    list_key = f"recent_news:{ticker}"

    article_json = json.dumps(article_data)
    redis_client.lpush(list_key, article_json)
    redis_client.ltrim(list_key, 0, 49)  # Keep 50 most recent articles