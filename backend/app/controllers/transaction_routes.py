from flask import Blueprint, request, jsonify
from app.services.transaction_service import transaction_service
from app.utils import get_start_and_end_from_month_year, QueryFilter
from flask import abort

transaction_bp = Blueprint("transaction_bp", __name__)
ALLOWED_PARAMS = {
    "month",
    "year",
    "category",
    "transaction_type",
}  # Define your allowed parameters


@transaction_bp.route("/", methods=["GET"])
def get_transactions():
    # Check for unexpected parameters
    unexpected_params = set(request.args.keys()) - ALLOWED_PARAMS
    if unexpected_params:
        abort(400, description=f"Unexpected parameters: {', '.join(unexpected_params)}")
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)
    category = request.args.get("category", type=str)
    transaction_type = request.args.get("transaction_type", type=str)
    if month and year:
        query_filter = QueryFilter(
            *get_start_and_end_from_month_year(int(month), int(year))
        )
    else:
        query_filter = QueryFilter()

    if category:
        query_filter.add_condition("category", category, "EQ")

    if transaction_type:
        query_filter.add_condition("transaction_type", transaction_type, "EQ")

    return transaction_service.get_transactions(query_filter)


@transaction_bp.route("/add_transaction", methods=["POST"])
def add_transaction():
    created = transaction_service.add_transaction(transaction_data=request.get_json())
    return (
        jsonify({"message": f"Transaction added successfully with id {created}"}),
        201,
    )


@transaction_bp.route("/<int:transaction_id>", methods=["GET"])
def get_transaction(transaction_id):
    return transaction_service.get_transaction_by_id(transaction_id).to_dict()


@transaction_bp.route("/bulk_update", methods=["PATCH"])
def bulk_update_transactions():
    # Parse the JSON payload
    data = request.get_json()

    # Check if data is not None
    if not data:
        return jsonify({"error": "Empty request body"}), 400

    bulk_update_data = [{"transaction_id": d.get('transactionId'), **d['changes']} for d in data]
    try:
        updated_ids = transaction_service.bulk_update_transactions(bulk_update_data)
        # Respond back to the client
        return jsonify({"message": "Bulk update payload received successfully"}), 200
    except:
        return jsonify({"error": "Something went wrong"}), 400
