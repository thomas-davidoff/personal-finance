from utils import logger
from app.repositories import transaction_repository
from collections import defaultdict
from decimal import Decimal
from datetime import datetime, timedelta


class TransactionService:
    def __init__(self):
        logger.info("initializing transactions service")

    def list_transactions(self, start_date, end_date):

        if not start_date:
            start_date = "1970-01-01"

        if not end_date:
            end_date = "2038-01-01"

        all_transactions = transaction_repository.get_transactions(
            start_date, end_date
        ).all()
        return [t.to_dict() for t in all_transactions]

    def add_transaction(
        self, description: str, amount: float, account_id: int, date: str
    ):
        transaction = transaction_repository.create_transaction(
            {
                "description": description,
                "amount": amount,
                "account_id": account_id,
                "date": date,
            }
        )
        return transaction.to_dict()

    def get_transaction(self, transaction_id):
        return transaction_repository.get_by_id(model_id=transaction_id).to_dict()

    def update_transaction(self, transaction_id, new_data):
        transaction = transaction_repository.update_transaction(
            transaction_id=transaction_id, new_transaction_data=new_data
        )
        print(transaction)
        return transaction.to_dict()

    def delete_transaction(self, transaction_id):
        deleted_transaction_message = transaction_repository.delete_by_id(
            model_id=transaction_id
        )
        return deleted_transaction_message

    def calc_daily_totals(self, start_date, end_date):
        transactions = transaction_repository.get_transactions(
            start_date=start_date, end_date=end_date
        ).all()

        daily_spending = defaultdict(Decimal)
        daily_credits = defaultdict(Decimal)

        for transaction in transactions:
            transaction_day = (transaction.date - start_date).days + 1
            if transaction.amount < 0:
                daily_spending[transaction_day] += Decimal(transaction.amount)
            else:
                daily_credits[transaction_day] += Decimal(transaction.amount)

        return {"debits": daily_spending, "credits": daily_credits}

    def calc_cumulative(self, start_date, end_date):
        start, end = self.format_start_end_dates(start_date, end_date)
        both_daily_totals = self.calc_daily_totals(start_date=start, end_date=end)
        results = {}

        for transaction_type in ["debits", "credits"]:
            daily_totals = both_daily_totals[transaction_type]
            result = []
            cumulative_total = 0
            day_counter = 1
            current_date = start
            while current_date <= end:
                cumulative_total += daily_totals[day_counter]
                result.append(
                    {
                        "day": day_counter,
                        "date": current_date.strftime("%m-%d-%Y"),
                        f"daily_{transaction_type}": float(daily_totals[day_counter]),
                        f"cumulative_{transaction_type}": float(cumulative_total),
                    }
                )
                current_date += timedelta(days=1)
                day_counter += 1

            results[transaction_type] = result

        return results

    def format_start_end_dates(self, start_date, end_date):
        return (datetime.strptime(date, "%Y-%m-%d") for date in [start_date, end_date])



transaction_service = TransactionService()
