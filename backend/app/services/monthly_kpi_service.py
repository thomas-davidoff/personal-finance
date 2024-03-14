from utils import logger
from app.services.transaction_service import transaction_service
from collections import defaultdict
from decimal import Decimal
from datetime import datetime, timedelta
from typing import Tuple, Dict
from app.utils import QueryFilter, get_start_and_end_from_month_year


class MonthlyKPIService:
    def __init__(self):
        logger.info("Initializing KPIs service")

    @staticmethod
    def create_filters(**kwargs) -> Dict:
        filters = {}
        for key, value in kwargs.items():
            if value is not None:
                filters[key] = value  # Use the value as-is for other types
        return filters

    @staticmethod
    def calculate_cumulative_spending(month, year):
        # create filters
        start_date, end_date = get_start_and_end_from_month_year(month, year)
        query_filter = QueryFilter(start_date=start_date, end_date=end_date)
        query_filter.add_condition(
            "transaction_type", operator="IN", value=["expense", "other"]
        )
        # Fetch transactions
        transactions = transaction_service.get_transactions(query_filter)
        daily_spending = defaultdict(Decimal)

        for t in [t for t in transactions if t["amount"] < 0]:
            date = datetime.strptime(t["date"].split("T")[0], "%m-%d-%Y")
            transaction_day = (date - start_date).days + 1
            daily_spending[transaction_day] += Decimal(str(t["amount"])) * -1

        # Prepare result list with daily and cumulative spending
        result = []
        cumulative_total = 0
        day_counter = 1
        current_date = start_date
        while current_date <= end_date:
            cumulative_total += daily_spending[day_counter]
            result.append(
                {
                    "day": day_counter,
                    "date": current_date.strftime("%m-%d-%Y"),
                    "daily_spending": float(daily_spending[day_counter]),
                    "cumulative_spending": float(cumulative_total),
                }
            )
            current_date += timedelta(days=1)
            day_counter += 1

        return result

    @staticmethod
    def aggregate(month, year):
        # create filters
        start_date, end_date = get_start_and_end_from_month_year(month, year)
        query_filter = QueryFilter(start_date=start_date, end_date=end_date)
        query_filter.add_condition(
            field="transaction_type", value=["account transfer"], operator="NOT_IN"
        )

        aggregate_by_category = transaction_service.get_aggregate_by_category(query_filter)
        aggregate_by_transaction_type = transaction_service.get_aggregate_by_transaction_type(
            query_filter
        )
        return aggregate_by_category, aggregate_by_transaction_type


monthly_kpi_service = MonthlyKPIService()
