from flask import Blueprint, request, jsonify
from app.services.transaction_service import transaction_service

transaction_bp = Blueprint("transaction_bp", __name__)


@transaction_bp.route("/", methods=["GET"])
def list_transactions():

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    return jsonify(
        transaction_service.list_transactions(start_date=start_date, end_date=end_date)
    )


@transaction_bp.route("/", methods=["POST"])
def create_transaction():
    new_transaction = transaction_service.add_transaction(
        description=request.json.get("description"),
        amount=request.json.get("amount"),
        account_id=request.json.get("account_id"),
    )
    return jsonify(new_transaction), 201


@transaction_bp.route("/<int:transaction_id>", methods=["GET"])
def get_a_transaction(transaction_id):
    transaction = transaction_service.get_transaction(transaction_id)
    return jsonify(transaction), 200


@transaction_bp.route("/list-by-account/<int:account_id>", methods=["GET"])
def list_transactions_by_account(account_id):
    return jsonify(transaction_service.list_transactions_by_account(account_id))


@transaction_bp.route("/list-by-category/<int:category_id>", methods=["GET"])
def list_transactions_by_category(category_id):
    return jsonify(transaction_service.list_transactions_by_category(category_id))


@transaction_bp.route("/<int:transaction_id>", methods=["PATCH"])
def update_transaction(transaction_id):
    new_transaction_data = request.json
    transaction = transaction_service.update_transaction(
        transaction_id=transaction_id, new_data=new_transaction_data
    )
    return jsonify(transaction)


@transaction_bp.route("/<int:transaction_id>", methods=["DELETE"])
def delete_account(transaction_id):
    deleted_message = transaction_service.delete_transaction(transaction_id)
    return deleted_message


@transaction_bp.route('/cumulative-spending', methods=['GET'])
def get_cumulative_spending():
    cumul_spending = transaction_service.calc_cumulative(start_date=request.args.get('start'), end_date=request.args.get('end'))
    return jsonify(cumul_spending), 200
