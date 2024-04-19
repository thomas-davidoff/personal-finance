from app.models import Account
from app.repositories.base_repository import BaseRepository


class AccountRepository(BaseRepository):
    def __init__(self, db_session) -> None:
        super().__init__(db_session=db_session, model=Account)

    def get_account_by_id(self, account_id) -> Account:
        return self.get_by_id(model_id=account_id)
    
    def create_account(self, account_data: dict) -> Account:
        account = Account(**account_data)
        self.db_session.add(account)
        self.db_session.commit()
        return account
        

