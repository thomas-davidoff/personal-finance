from app.models import Transaction
from sqlalchemy import extract, func, case
from app.repositories.base_repository import BaseRepository


class TransactionRepository(BaseRepository):
    def __init__(self, db_session) -> None:
        super().__init__(db_session=db_session, model=Transaction)

    def _start_date(self, start=None):
        return start or "1970-01-01"

    def get_transactions(
        self,
        start_date=None,
        end_date=None,
        account_id=None,
        category_id=None,
        filters: dict = {},
    ) -> Transaction.query_class:

        if start_date is None:
            start_date = "1970-01-01"

        if end_date is None:
            end_date = "2038-01-01"

        if filters:
            pass

        transactions = self.db_session.query(Transaction).filter(
            Transaction.date.between(start_date, end_date)
        )

        if account_id:
            transactions = transactions.filter_by(account_id=account_id)
        if category_id:
            transactions = transactions.filter_by(category_id=category_id)

        return transactions.order_by(Transaction.date)

    def create_transaction(self, new_transaction_data: dict) -> Transaction:

        transaction = Transaction(**new_transaction_data)

        self.db_session.add(transaction)
        self.db_session.commit()
        return transaction

    def filter_by_account_id(self, query, account_id):
        return query.filter_by(account_id=account_id)

    def update_transaction(self, transaction_id, new_transaction_data) -> Transaction:
        return self.update_by_id(transaction_id, new_transaction_data)

    def get_grouped_transactions(self, start, end):
        transactions = (
            self.db_session.query(
                extract("month", Transaction.date).label("month"),
                Transaction.category_id,
                func.sum(
                    case((Transaction.amount < 0, Transaction.amount), else_=0)
                ).label("total_debits"),
                func.count(Transaction.id).label("num_transactions"),
            )
            .filter(Transaction.date.between(start, end), Transaction.amount < 0)
            .group_by(extract("month", Transaction.date), Transaction.category_id)
        )
        return transactions
