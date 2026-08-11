import json
from database.client import redis_client
from services.market_service import fetch_all_quotes, DEFAULT_TICKERS

def run_market_worker(tickers=None):
    """
    Downloads latest market price quotes for tickers and stores in Redis Hash ('stock:{ticker}').
    """
    if tickers is None:
        tickers = DEFAULT_TICKERS

    quotes = fetch_all_quotes(tickers)
    updated_count = 0

    for quote in quotes:
        ticker = quote["ticker"]
        hash_key = f"stock:{ticker}"

        # Store individual fields in Redis Hash
        for field, value in quote.items():
            redis_client.hset(hash_key, field, str(value))

        updated_count += 1

    print(f"[MarketWorker] Successfully updated {updated_count} stock hashes in Redis.")
    return updated_count

if __name__ == "__main__":
    run_market_worker()
