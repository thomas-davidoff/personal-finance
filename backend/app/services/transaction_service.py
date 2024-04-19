from utils import logger
from app.repositories import transaction_repository


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

    def add_transaction(self, description: str, amount: float, account_id: int, date: str):
        transaction = transaction_repository.create_transaction(
            {"description": description, "amount": amount, "account_id": account_id, "date": date}
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


transaction_service = TransactionService()
