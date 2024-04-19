from datetime import timedelta
import collections
from app import db
from app.repositories import transaction_repository, account_repository


class AccountService:
    def __init__(self) -> None:
        pass

    def get_transactions_for_account(self, account_id):
        account = account_repository.get_account_by_id(account_id=account_id)
        assert account, "Account not found"
        return [t.to_dict() for t in account.transactions]

    def get_all_accounts(self):
        accounts_query = account_repository._get_all_with_filter()
        accounts = accounts_query.all()
        return [self.get_account(a.id) for a in accounts]

    def get_account(self, account_id):
        self.recalculate_current_balance(account_id=account_id)
        return account_repository.get_account_by_id(account_id=account_id).to_dict()

    def recalculate_current_balance(self, account_id):
        account = account_repository.get_account_by_id(account_id)
        starting_balance = account.starting_balance
        transactions = account.transactions
        current_balance = starting_balance
        for transaction in transactions:
            current_balance += transaction.amount

    def get_running_balance(self, account_id, start_date=None, end_date=None):
        account = account_repository.get_account_by_id(account_id=account_id)
        # Step 1: Fetch and sort transactions
        transactions = transaction_repository.get_transactions(
            start_date, end_date, account_id=account_id
        ).all()

        if transactions:
            # Step 2: Initialize data structures
            daily_balances = collections.OrderedDict()
            start_date = transactions[0].date.date()
            end_date = transactions[-1].date.date()

            # Populate initial dict with all dates set to a balance of 0
            current_date = start_date
            while current_date <= end_date:
                daily_balances[current_date] = 0
                current_date += timedelta(days=1)

            # Step 3: Populate the daily changes
            for transaction in transactions:
                transaction_date = transaction.date.date()
                daily_balances[transaction_date] += transaction.amount

            # Step 4: Calculate the running total
            current_balance = account.starting_balance
            running_balances = []
            for date, daily_change in daily_balances.items():
                current_balance += daily_change
                running_balances.append(
                    {
                        "date": date.strftime("%m-%d-%Y"),
                        "running_balance": current_balance,
                    }
                )
        else:
            return "No transactions available"

        account.current_balance = running_balances[-1]["running_balance"]
        db.session.commit()

        return {
            "starting_balance": account.starting_balance,
            "current_balance": running_balances[-1]["running_balance"],
            "running_balance": running_balances,
            "daily_balances": {
                k.strftime("%m-%d,%Y"): v for k, v in daily_balances.items()
            },
        }

    def create_account(self, account_name, account_type, starting_balance=None):
        account = account_repository.create_account(
            {
                "name": account_name,
                "account_type": account_type,
                "starting_balance": starting_balance,
            }
        )
        return account.to_dict()
    
    def delete_account(self, account_id):
        deleted_account_message = account_repository.delete_by_id(model_id=account_id)
        return deleted_account_message
