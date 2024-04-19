from .transaction_repository import TransactionRepository
from .account_repository import AccountRepository
from .category_repository import CategoryRepository
from .keyword_repository import KeywordRepository

from app import db

transaction_repository = TransactionRepository(db_session=db.session)
account_repository = AccountRepository(db_session=db.session)
category_repository = CategoryRepository(db_session=db.session)
keyword_repository = KeywordRepository(db_session=db.session)
