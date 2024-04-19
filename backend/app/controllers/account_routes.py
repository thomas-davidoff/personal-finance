from flask import Blueprint, jsonify, abort, request
from app import db
from app.models import Account, Transaction
from app.services import transaction_service
from app.services.account_service import AccountService


account_bp = Blueprint("account_bp", __name__)
account_service = AccountService()



@account_bp.route("/", methods=["GET"])
def list_accounts():
    accounts = account_service.get_all_accounts()
    return jsonify(accounts), 200


@account_bp.route("/<int:account_id>/transactions")
def list_transactions_for_account(account_id):
    try:
        transactions = account_service.get_transactions_for_account(
            account_id=account_id
        )
    except AssertionError as e:
        abort(404, e)
    return jsonify(transactions), 200


@account_bp.route("/<int:account_id>")
def get_account(account_id):
    return account_service.get_account(account_id)


@account_bp.route("/balances", methods=["GET"])
def get_account_balances():
    return account_service.get_account_balances()


@account_bp.route("/<int:account_id>/running_balance", methods=["GET"])
def get_running_balance(account_id):
    current_balance = account_service.get_running_balance(account_id=account_id)
    return jsonify(current_balance), 200


@account_bp.route("/", methods=["POST"])
def create_account():
    account_data = request.json
    account = account_service.create_account(
        account_name=account_data.get('account_name'),
        account_type=account_data.get("account_type"),
        starting_balance=account_data.get("starting_balance"),
    )
    return jsonify(account), 201


@account_bp.route('/<int:account_id>', methods=['DELETE'])
def delete_account(account_id):
    deleted_message = account_service.delete_account(account_id)
    return deleted_message