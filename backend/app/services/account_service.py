import collections
from app import db
from app.repositories import transaction_repository, account_repository
from datetime import datetime, timedelta


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

    def get_running_balance(self, start_date=None, end_date=None):
        accounts = account_repository._get_all_with_filter()
        results = []
        for account in accounts:
            transactions = transaction_repository.get_transactions(
                account_id=account.id
            ).all()

            if not transactions:
                continue

            rb_start = transactions[0].date.date()
            rb_end_date = transactions[-1].date.date()
            # Step 2: Initialize data structures
            daily_balances = collections.OrderedDict()

            # Populate initial dict with all dates set to a balance of 0
            current_date = rb_start
            while current_date <= rb_end_date:
                daily_balances[current_date.strftime("%Y-%m-%d")] = 0
                current_date += timedelta(days=1)

            # Step 3: Populate the daily changes
            for transaction in transactions:
                transaction_date = transaction.date.date()
                daily_balances[
                    transaction_date.strftime("%Y-%m-%d")
                ] += transaction.amount

            # Step 4: Calculate the running total
            current_balance = account.starting_balance
            running_balances = {}
            for date, daily_change in daily_balances.items():
                current_balance += daily_change
                running_balances[date] = current_balance

            results.append(
                {
                    "account_name": account.name,
                    "running_balance": running_balances,
                    "daily_balance": daily_balances,
                }
            )
            account.current_balance = running_balances[rb_end_date.strftime("%Y-%m-%d")]
            db.session.commit()
        all_dates = set()
        for account in results:
            running_balances = account["running_balance"]
            for date in running_balances:
                all_dates.add(date)

        end_result = []
        for date in all_dates:
            if not all([date >= start_date, date <= end_date]):
                continue

            result_dict = {
                "date":date,
                    **{
                        account["account_name"]: round(account["running_balance"].get(date, 0),2)
                        for account in results
                    }
            }

            result_dict['net_worth'] = sum([val for k, val in result_dict.items() if k != 'date'])
            print(result_dict)

            end_result.append(result_dict)

        

        return sorted(end_result, key=lambda x: x["date"], reverse=False)

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
    