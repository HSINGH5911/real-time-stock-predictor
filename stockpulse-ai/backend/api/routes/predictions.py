from fastapi import APIRouter
from api.routes.predict import get_prediction, get_prediction_history, get_backtest_report

router = APIRouter(prefix="/predictions", tags=["predictions"])

# Mount route handlers under /predictions prefix as well
router.add_api_route("/backtest", get_backtest_report, methods=["GET"])
router.add_api_route("/{ticker}/history", get_prediction_history, methods=["GET"])
router.add_api_route("/{ticker}", get_prediction, methods=["GET"])
