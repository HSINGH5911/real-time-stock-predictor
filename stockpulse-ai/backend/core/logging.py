import logging
import sys

def setup_logging(level=logging.INFO):
    """
    Configures structured logging output for StockPulse AI backend.
    Format: YYYY-MM-DD HH:MM:SS [LEVEL] [NAME]: MESSAGE
    """
    logger = logging.getLogger("stockpulse")
    logger.setLevel(level)

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(level)
        formatter = logging.Formatter(
            fmt="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger

logger = setup_logging()
