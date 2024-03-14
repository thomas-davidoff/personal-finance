from app.repositories.repositories import BaseDAO
from app.models import Transaction, Category, Account
from sqlalchemy import func, not_
from utils import logger
from app.utils import QueryFilter


class TransactionDAO(BaseDAO):

    def __init__(self):
        logger.info("initializing transactions DAO")
        super().__init__()
        self.primary_model = Transaction

    @staticmethod
    def _apply_filters(query, filter_object: QueryFilter):

        query = query.filter(
            Transaction.date >= filter_object.start_date,
            Transaction.date <= filter_object.end_date,
        )

        for condition in filter_object.conditions:
            logger.debug(condition)
            if condition["field"] == "transaction_type" and "category" in str(query):
                logger.debug("filtering for transaction type")
                if condition["operator"] == "EQ":
                    logger.debug(condition["value"])
                    query = query.filter(
                        func.upper(Category.transaction_type)
                        == func.upper(condition["value"])
                    )
                elif condition["operator"] == "IN":
                    logger.debug("applying in logic")
                    assert isinstance(condition["value"], list)
                    query = query.filter(
                        func.upper(Category.transaction_type).in_(condition["value"])
                    )
                elif condition["operator"] == "NOT_IN":
                    logger.debug("applying NOT_IN logic")
                    assert isinstance(condition["value"], list)
                    query = query.filter(
                        not_(
                            func.upper(Category.transaction_type).in_(
                                condition["value"]
                            )
                        )
                    )

                else:
                    raise NotImplementedError
            elif condition["field"] == "category" and "category" in str(query):
                logger.debug("filtering for category")
                if condition["operator"] == "EQ":
                    logger.debug(condition["value"])
                    query = query.filter(
                        func.upper(Category.name) == func.upper(condition["value"])
                    )
        return query

    def get_transactions(self, query_filter=None):
        if query_filter is None:
            query_filter = QueryFilter()
        query = (
            self.session.query(Transaction, Category, Account)
            .join(Category, Transaction.category_id == Category.id)
            .join(Account, Transaction.account_id == Account.id)
        )

        query = self._apply_filters(query, query_filter)

        return query.all()

    def create_transaction(self, transaction_data):
        new_transaction = Transaction(
            description=transaction_data["description"],
            amount=transaction_data["amount"],
        )
        self.session.add(new_transaction)
        self.session.commit()

        return new_transaction.id

    def aggregate_by_category(self, filters=None):
        query = self.session.query(
            func.sum(Transaction.amount).label("total"),
            Category.transaction_type,
            Category.name.label("category_name"),
            # other fields as needed
        ).join(Category, Transaction.category_id == Category.id)
        query = self._apply_filters(query, filters)
        query = query.group_by(Category.transaction_type, Category.name)
        return query.all()

    def aggregate_by_transaction_type(self, filters=None):
        query = self.session.query(
            func.sum(Transaction.amount).label("total"), Category.transaction_type
        ).join(Category, Transaction.category_id == Category.id)

        query = self._apply_filters(query, filters)
        query = query.group_by(Category.transaction_type)

        return query.all()

    def update_transaction(
        self, transaction_id, new_category_name=None, new_description=None
    ):
        logger.debug(f"updating transaction with id {transaction_id}")
        # Fetch the transaction
        transaction = (
            self.session.query(Transaction).filter_by(id=transaction_id).first()
        )

        if new_category_name:
            logger.debug("setting new category to transaction")
            # find the associated category by name
            category = (
                self.session.query(Category).filter_by(name=new_category_name).one()
            )
            transaction.category_id = category.id

        if new_description:
            logger.debug("setting new description to transaction")
            transaction.description = new_description
        self.session.commit()

        return transaction_id


transaction_dao = TransactionDAO()
