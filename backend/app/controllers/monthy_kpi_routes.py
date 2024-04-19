from flask import Blueprint, request, abort, Response
from json import dumps
from datetime import datetime

from app.services.monthly_kpi_service import monthly_kpi_service

monthly_kpi_bp = Blueprint("monthly_kpi_bp", __name__)


@monthly_kpi_bp.route("/cumulative", methods=["GET"])
def cumulative_monthly_spending():
    month = request.args.get("month")
    year = request.args.get("year")

    if not month or not year:
        this_month = datetime.now().strftime("%m-%Y")
        month, year = this_month.split("-")

    return monthly_kpi_service.calculate_cumulative_spending(int(month), int(year))


@monthly_kpi_bp.route("/", methods=["GET"])
def monthly_summary():
    month = request.args.get("month")
    year = request.args.get("year")

    if not month or not year:
        this_month = datetime.now().strftime("%m-%Y")
        month, year = this_month.split("-")

    month, year = int(month), int(year)

    cumulative_spending = monthly_kpi_service.calculate_cumulative_spending(month, year)
    aggregate_by_category, aggregate_by_transaction_type = (
        monthly_kpi_service.aggregate(month, year)
    )

    resp = {
        "cumulative_spending": cumulative_spending,
        "aggregate_by_category": aggregate_by_category,
        "aggregate_by_transaction_type": aggregate_by_transaction_type,
    }

    return resp
