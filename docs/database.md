# Custom Redis Database Engine Specification

StockPulse AI features a lightweight, custom in-memory Redis database implemented in Python (`backend/database/`).

## Architecture & Data Structures

- **Core Engine**: Thread-safe in-memory key-value database (`Database`) supporting string, hash, list, set, sorted set, and stream data types.
- **RESP Protocol Parser**: Encodes and decodes RESP (Redis Serialization Protocol) format strings (`+OK\r\n`, `$-1\r\n`, `*2\r\n...`).
- **Persistence**: RDB binary serialization snapshots (`dump.rdb`).

## Key Keys & Data Formats

| Key Pattern | Type | Description |
| :--- | :--- | :--- |
| `stock:{TICKER}` | **Hash** | Holds latest quote, volume, FinBERT sentiment score, article count, and timestamp. |
| `news_stream` / `stream:news_events` | **Stream** | Live stream of incoming financial news articles with event category tags. |
| `recent_news:{TICKER}` | **List** | List of recent news JSON objects mapped to ticker. |
| `features:{TICKER}` | **Hash/String** | Cached 18-dimensional feature vector. |
| `prediction:{TICKER}` | **Hash** | Latest model prediction direction, confidence %, probability up/down. |
| `prediction_history:{TICKER}` | **List** | Logged history of predictions for auditing and accuracy verification. |

## Supported Commands

- **Strings**: `SET`, `GET`, `DEL`, `EXISTS`, `INCR`, `EXPIRE`
- **Hashes**: `HSET`, `HGET`, `HGETALL`, `HDEL`, `HEXISTS`
- **Lists**: `LPUSH`, `RPUSH`, `LPOP`, `RPOP`, `LRANGE`, `LTRIM`, `LLEN`
- **Streams**: `XADD`, `XREAD`, `XRANGE`, `XLEN`, `XTRIM`
