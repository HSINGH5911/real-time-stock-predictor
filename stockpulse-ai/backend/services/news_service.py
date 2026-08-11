import os
import re
import uuid
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MARKETAUX_API_KEY = os.getenv("MARKETAUX_API_KEY") or os.getenv("MARKETAUX_TOKEN")
DEFAULT_SYMBOLS = [
    "AAPL", "NVDA", "MSFT", "GOOGL", "AMZN",
    "META", "TSLA", "BRK-B", "AVGO", "LLY",
    "WMT", "JPM", "V", "UNH", "XOM",
    "ORCL", "MA", "COST", "HD", "PG"
]

TRACKED_TICKER_MAP = {
    "AAPL": [r"\bAAPL\b", r"\bApple\b", r"\biPhone\b", r"\bMacBook\b"],
    "NVDA": [r"\bNVDA\b", r"\bNvidia\b", r"\bNVIDIA\b", r"\bBlackwell\b"],
    "MSFT": [r"\bMSFT\b", r"\bMicrosoft\b", r"\bAzure\b", r"\bCopilot\b"],
    "GOOGL": [r"\bGOOGL\b", r"\bGOOG\b", r"\bAlphabet\b", r"\bGoogle\b", r"\bGemini\b"],
    "AMZN": [r"\bAMZN\b", r"\bAmazon\b", r"\bAWS\b"],
    "META": [r"\bMETA\b", r"\bMeta\b", r"\bInstagram\b", r"\bWhatsApp\b"],
    "TSLA": [r"\bTSLA\b", r"\bTesla\b", r"\bCybertruck\b"],
    "BRK-B": [r"\bBRK\b", r"\bBerkshire\b", r"\bBuffett\b"],
    "AVGO": [r"\bAVGO\b", r"\bBroadcom\b"],
    "LLY": [r"\bLLY\b", r"\bEli Lilly\b", r"\bLilly\b"],
    "WMT": [r"\bWMT\b", r"\bWalmart\b"],
    "JPM": [r"\bJPM\b", r"\bJPMorgan\b", r"\bJP Morgan\b"],
    "V": [r"\bV\b", r"\bVisa\b"],
    "UNH": [r"\bUNH\b", r"\bUnitedHealth\b"],
    "XOM": [r"\bXOM\b", r"\bExxon\b"],
    "ORCL": [r"\bORCL\b", r"\bOracle\b"],
    "MA": [r"\bMA\b", r"\bMastercard\b"],
    "COST": [r"\bCOST\b", r"\bCostco\b"],
    "HD": [r"\bHD\b", r"\bHome Depot\b"],
    "PG": [r"\bPG\b", r"\bProcter\b"]
}

EVENT_PATTERNS = {
    "Earnings": [r"\bearnings\b", r"\beps\b", r"\bquarterly results\b", r"\brevenue\b", r"\bprofit\b", r"\bguidance\b", r"\bbeats\b", r"\bmisses\b"],
    "Layoffs": [r"\blayoffs\b", r"\bjob cuts\b", r"\bworkforce reduction\b", r"\brestructuring\b", r"\bfiring\b"],
    "Leadership": [r"\bceo\b", r"\bcfo\b", r"\bexecutive\b", r"\bappointed\b", r"\bresigns\b", r"\bstepping down\b"],
    "Dividend": [r"\bdividend\b", r"\bstock buyback\b", r"\bshare repurchase\b"],
    "Acquisition": [r"\bacquisition\b", r"\bmerger\b", r"\bacquires\b", r"\bbuyout\b", r"\btakeover\b", r"\bbought\b"],
    "Product Launch": [r"\bproduct launch\b", r"\bunveils\b", r"\bnext-gen\b", r"\bannounces\b", r"\bchip\b"],
    "AI": [r"\bai\b", r"\bartificial intelligence\b", r"\bgemini\b", r"\bcopilot\b", r"\bllm\b", r"\bchatgpt\b"],
    "Regulatory": [r"\bfda\b", r"\btariffs\b", r"\bsec\b", r"\binvestigation\b", r"\bantitrust\b", r"\blawsuit\b"]
}


def extract_tickers(raw_item: dict) -> list[str]:
    """
    Step 8: Extracts matching tracked stock tickers from article metadata and text context.
    """
    matched = set()

    # 1. Metadata entity extraction
    entities = raw_item.get("entities", [])
    if isinstance(entities, list):
        for entity in entities:
            sym = entity.get("symbol", "").upper()
            if sym in TRACKED_TICKER_MAP:
                matched.add(sym)

    # 2. Text regex extraction (Headline + Summary)
    text_content = f"{raw_item.get('title', '')} {raw_item.get('snippet', '')} {raw_item.get('description', '')}"

    for ticker, patterns in TRACKED_TICKER_MAP.items():
        for pattern in patterns:
            if re.search(pattern, text_content, re.IGNORECASE):
                matched.add(ticker)
                break

    return list(matched)


def detect_event(text_content: str) -> str:
    """
    Step 10: Categorizes article into key financial event categories based on keyword patterns.
    """
    for event_name, patterns in EVENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_content, re.IGNORECASE):
                return event_name
    return "General"


def fetch_latest_news(symbols=None) -> list[dict]:
    """
    Step 9: Fetches financial news from MarketAux API (or sample feed), normalizes
    and enriches objects with id, ticker list, headline, summary, source, timestamp, url, and event tags.
    """
    if symbols is None:
        symbols = DEFAULT_SYMBOLS

    api_key = os.getenv("MARKETAUX_API_KEY") or os.getenv("MARKETAUX_TOKEN")

    if api_key and api_key != "your_marketaux_api_key_here":
        try:
            symbols_str = ",".join(symbols) if isinstance(symbols, list) else symbols
            url = "https://api.marketaux.com/v1/news/all"
            params = {
                "symbols": symbols_str,
                "filter_entities": "true",
                "language": "en",
                "api_token": api_key,
                "limit": 10
            }
            response = requests.get(url, params=params, timeout=5)
            if response.status_code == 200:
                raw_data = response.json().get("data", [])
                normalized = []
                for item in raw_data:
                    headline = item.get("title", "Market Update")
                    summary = item.get("snippet", item.get("description", ""))
                    text_comb = f"{headline} {summary}"

                    matched_tickers = extract_tickers(item)
                    # Step 8 rule: If no tracked tickers matched, default to primary queried symbol
                    if not matched_tickers:
                        matched_tickers = [symbols[0]]

                    event_type = detect_event(text_comb)

                    normalized.append({
                        "id": str(item.get("uuid", uuid.uuid4())),
                        "tickers": matched_tickers,
                        "ticker": matched_tickers[0],
                        "headline": headline,
                        "summary": summary,
                        "source": item.get("source", "MarketAux"),
                        "timestamp": item.get("published_at", datetime.now(timezone.utc).isoformat()),
                        "url": item.get("url", "#"),
                        "event": event_type
                    })
                if normalized:
                    return normalized
        except Exception as e:
            print(f"[NewsService] MarketAux API call failed: {e}. Falling back to sample news feed.")

    # Fallback / Mock news generator for immediate offline testing
    now_iso = datetime.now(timezone.utc).isoformat()
    return [
        {
            "id": "art-101",
            "tickers": ["AAPL"],
            "ticker": "AAPL",
            "headline": "Apple Beats Quarterly Earnings Estimates on Strong iPhone & Services Growth",
            "summary": "Apple Inc reported quarterly revenue and profit that topped Wall Street estimates, driven by record services growth.",
            "source": "Financial Times",
            "timestamp": now_iso,
            "url": "https://finance.yahoo.com/quote/AAPL",
            "event": "Earnings"
        },
        {
            "id": "art-102",
            "tickers": ["TSLA"],
            "ticker": "TSLA",
            "headline": "Tesla Unveils Next-Gen AI Chip for Full Autonomous Driving Fleet",
            "summary": "Tesla introduced its latest custom AI accelerator designed for high-density training and onboard inference.",
            "source": "Bloomberg",
            "timestamp": now_iso,
            "url": "https://finance.yahoo.com/quote/TSLA",
            "event": "Product Launch"
        },
        {
            "id": "art-103",
            "tickers": ["NVDA"],
            "ticker": "NVDA",
            "headline": "NVIDIA Expands Data Center AI Dominance with Record Enterprise Demand",
            "summary": "NVIDIA posted record quarterly revenue as global cloud providers and tech giants accelerate generative AI infrastructure buildouts.",
            "source": "Reuters",
            "timestamp": now_iso,
            "url": "https://finance.yahoo.com/quote/NVDA",
            "event": "AI"
        },
        {
            "id": "art-104",
            "tickers": ["MSFT"],
            "ticker": "MSFT",
            "headline": "Microsoft Cloud Revenue Surges 25% Driven by Azure Copilot Adoption",
            "summary": "Microsoft Corporation announced impressive earnings boosted by enterprise adoption of OpenAI models on Azure.",
            "source": "Wall Street Journal",
            "timestamp": now_iso,
            "url": "https://finance.yahoo.com/quote/MSFT",
            "event": "Earnings"
        },
        {
            "id": "art-105",
            "tickers": ["GOOGL"],
            "ticker": "GOOGL",
            "headline": "Alphabet Accelerates Gemini 2.0 Deployment Across Google Cloud Ecosystem",
            "summary": "Alphabet Inc highlighted rapid enterprise adoption of Gemini models across Search, Workspace, and Cloud.",
            "source": "CNBC",
            "timestamp": now_iso,
            "url": "https://finance.yahoo.com/quote/GOOGL",
            "event": "AI"
        }
    ]
