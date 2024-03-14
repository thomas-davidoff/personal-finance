from app.repositories.repositories.transaction_DAO import transaction_dao
from utils import logger
from decimal import Decimal
from app.utils import QueryFilter


class TransactionService:
    def __init__(self):
        logger.info("initializing transactions service")

    @staticmethod
    def get_transaction_by_id(transaction_id: int):
        return transaction_dao.get_by_id(transaction_id)

    @staticmethod
    def get_transactions(query_filter=None):
        transactions = transaction_dao.get_transactions(query_filter=query_filter)
        return [
            {
                **tr.to_dict(ids=False),
                "category": cat.name,
                "account": acc.name,
                "type": cat.transaction_type,
            }
            for tr, cat, acc in transactions
        ]

    @staticmethod
    def add_transaction(transaction_data: dict):
        return transaction_dao.create_transaction(transaction_data)

    @staticmethod
    def get_aggregate_by_category(filters):
        return [
            {
                "total": float(Decimal(transaction.total).quantize(Decimal("0.00"))),
                "category": transaction.category_name,
                "transaction_type": transaction.transaction_type,
            }
            for transaction in transaction_dao.aggregate_by_category(filters=filters)
        ]

    @staticmethod
    def get_aggregate_by_transaction_type(filters):
        return [
            {
                "total": float(Decimal(transaction.total).quantize(Decimal("0.00"))),
                "transaction_type": transaction.transaction_type,
            }
            for transaction in transaction_dao.aggregate_by_transaction_type(
                filters=filters
            )
        ]

    def bulk_update_transactions(self, transactions_data):
        print(transactions_data)
        updated_ids = []
        for datum in transactions_data:
            logger.debug(f"calling transaction dao to update transaction: {datum}")
            updated_id = transaction_dao.update_transaction(
                transaction_id=datum['transaction_id'],
                new_description=datum.get('description'),
                new_category_name=datum.get('category')
            )
            updated_ids.append(updated_id)

        return updated_ids

transaction_service = TransactionService()
