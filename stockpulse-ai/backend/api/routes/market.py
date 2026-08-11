from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query
from database.client import redis_client
from services.market_service import DEFAULT_TICKERS
from workers.market_worker import run_market_worker

router = APIRouter(prefix="/market", tags=["Market Data"])

def _is_quote_stale(hash_data: dict, max_age_seconds: int = 30) -> bool:
    if not hash_data or "timestamp" not in hash_data:
        return True
    try:
        ts_str = hash_data["timestamp"]
        quote_dt = datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
        age = (datetime.now(timezone.utc) - quote_dt).total_seconds()
        return age > max_age_seconds
    except Exception:
        return True

@router.get("")
@router.get("/")
def get_all_market_data(refresh: bool = Query(False)):
    """
    Returns latest stock quote hashes stored in custom Redis database.
    Automatically refreshes live quotes if quotes are stale (older than 30s).
    """
    stocks = []
    any_stale = False

    for ticker in DEFAULT_TICKERS:
        hash_data = redis_client.hgetall(f"stock:{ticker}")
        if hash_data:
            stocks.append(hash_data)
            if _is_quote_stale(hash_data):
                any_stale = True

    # If database is empty, quotes missing, stale, or refresh requested, fetch live quotes
    if refresh or any_stale or not stocks or len(stocks) < len(DEFAULT_TICKERS):
        run_market_worker()
        stocks = []
        for ticker in DEFAULT_TICKERS:
            hash_data = redis_client.hgetall(f"stock:{ticker}")
            if hash_data:
                stocks.append(hash_data)

    return {"count": len(stocks), "data": stocks}

@router.get("/{ticker}")
def get_stock_quote(ticker: str, refresh: bool = Query(False)):
    ticker = ticker.upper()
    hash_data = redis_client.hgetall(f"stock:{ticker}")

    if refresh or not hash_data or _is_quote_stale(hash_data):
        run_market_worker([ticker])
        hash_data = redis_client.hgetall(f"stock:{ticker}")
    
    if not hash_data:
        raise HTTPException(status_code=404, detail=f"Stock quote for {ticker} not found.")
    
    return {"ticker": ticker, "data": hash_data}
