from utils import logger
from app.repositories import transaction_repository, category_repository
from collections import defaultdict, Counter
from decimal import Decimal
from datetime import datetime, timedelta
from app.exceptions import ValidationError
import re


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

    def add_transaction(self, new_data):
        transaction = transaction_repository.create_transaction(
            {**new_data, "date": self._format_date(new_data["date"])}
        )
        return transaction.to_dict()

    def get_transaction(self, transaction_id):
        return transaction_repository.get_by_id(model_id=transaction_id).to_dict()

    def update_transaction(self, transaction_id, new_data):
        transaction = transaction_repository.update_transaction(
            transaction_id=transaction_id,
            new_transaction_data={
                **new_data,
                "date": self._format_date(new_data["date"]),
            },
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

    def _format_date(self, date_string):
        return datetime.strptime(date_string, "%Y-%m-%d")

    def format_start_end_dates(self, start_date, end_date):
        if not start_date:
            start_date = "1970-01-01"
        if not end_date:
            end_date = "2038-01-01"

        return (self._format_date(date) for date in [start_date, end_date])

    def get_aggregate_by_category(self, start, end):
        start, end = self.format_start_end_dates(start_date=start, end_date=end)
        transactions = transaction_repository.get_grouped_transactions(start, end)
        grouped = [
            {
                "month": c.month,
                "category_id": c.category_id,
                "category_name": category_repository.get_by_id(c.category_id).name,
                "total_debits": c.total_debits,
                "num_transactions": c.num_transactions,
            }
            for c in transactions.all()
        ]

        categories = {g.get("category_name") for g in grouped}
        months = {g.get("month") for g in grouped}

        def find_value_in_groups(groups, month, category_name):
            for group in groups:
                print(group)
                if group["month"] == month and category_name in group.values():
                    return round(group["total_debits"], 2) * -1
            return 0

        grouped_by_months = [
            {
                "month": month,
                **{
                    category: find_value_in_groups(grouped, month, category)
                    for category in categories
                },
            }
            for month in months
        ]
        return grouped_by_months

    def find_most_common_descriptions(
        self, min_consecutive, min_word_length, ignore_words, number_to_return
    ):

        ignore_list = [w.strip().lower() for w in ignore_words.split(",")]

        min_consecutive = int(min_consecutive) or 1
        min_word_length = int(min_word_length) or 3
        number_to_return = int(number_to_return) or 20

        all_uncategorized = transaction_repository.get_transactions(category_id=1)
        normalized_descriptions = [
            {
                "transaction": transaction,
                "normalized_description": re.sub(
                    "[^a-zA-Z]+", "*", transaction.description
                ).lower(),
            }
            for transaction in all_uncategorized
        ]

        place = Counter()
        associations_store = {}
        for datum in normalized_descriptions:
            transaction = datum["transaction"]
            sentence = datum["normalized_description"]
            words = [w.strip() for w in sentence.split("*")]
            words = [
                w for w in words if w not in ignore_list and len(w) >= min_word_length
            ]
            patterns = []
            i = 0
            while (i + min_consecutive - 1) < len(words):
                consecutive_list = []
                for index in range(0, min_consecutive):
                    consecutive_list.append(words[index + i])
                joined = "|".join(consecutive_list)
                patterns.append(joined)
                if joined not in associations_store:
                    associations_store[joined] = [transaction.to_dict()]
                else:
                    associations_store[joined].append(transaction.to_dict())
                i += 1

            place.update(patterns)

        top_20_words = place.most_common(number_to_return)

        result = []
        for phrase, count in top_20_words:
            unique_transactions = Counter()
            transactions = associations_store[phrase]
            total_amount = sum([t["amount"] for t in transactions])
            avg_amount = total_amount / len(transactions)

            transaction_keys = [
                "*****".join(
                    [
                        "description$$$" + re.sub(" +", " ", t["description"]),
                        "category$$$" + t["category"]["name"],
                        "account$$$" + t["account"]["name"],
                    ]
                )
                for t in transactions
            ]
            unique_transactions.update(transaction_keys)
            result.append(
                {
                    "phrase": phrase,
                    "count": count,
                    "avg_amount": avg_amount,
                    "total_amount": total_amount,
                    "combos": [
                        {
                            "count": count,
                            "key": {
                                text.split("$$$")[0]: text.split("$$$")[1]
                                for text in desc.split("*****")
                            },
                        }
                        for desc, count in unique_transactions.most_common(5)
                    ],
                }
            )
        return result


transaction_service = TransactionService()
