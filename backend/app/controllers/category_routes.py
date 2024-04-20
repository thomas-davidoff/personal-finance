from flask import Blueprint, jsonify, request, abort
from app import db
from app.models import Category
from app.services import category_service
from app.utils import QueryFilter

category_bp = Blueprint("category_bp", __name__)


@category_bp.route("/", methods=["GET"])
def list_categories():
    filters = {}
    names = request.args.get("names")
    if names:
        filters["name"] = [name.upper().strip() for name in names.split(",")]
    categories = category_service.list_categories(filters)
    return jsonify(categories), 200


@category_bp.route("/<int:category_id>/transactions", methods=["GET"])
def list_transactions_in_category(category_id):
    transactions = category_service.list_transactions(category_id=category_id)
    return jsonify(transactions), 200


@category_bp.route("/<int:category_id>")
def get_category_by_id(category_id):
    category = category_service.get_category(category_id=category_id)
    return jsonify(category), 200


@category_bp.route("/<string:category_name>")
def get_category_by_name(category_name):
    category = category_service.get_category(category_name=category_name)
    return jsonify(category), 200


@category_bp.route("/categorize-transactions", methods=["PATCH"])
def categorize_transactions():
    result = category_service.categorize_transactions()
    return jsonify(result)


@category_bp.route("/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    deleted_message = category_service.delete_category(category_id)
    return deleted_message


@category_bp.route("/", methods=["POST"])
def create_category():
    new_category = category_service.add_category(
        {
            "description": request.json.get("description"),
            "name": request.json.get("name"),
            "transaction_subtype": request.json.get("transaction_subtype"),
            "transaction_type": request.json.get("transaction_type"),
        }
    )
    return jsonify(new_category), 201


@category_bp.route("/<int:category_id>", methods=["PATCH"])
def update_category(category_id):
    return category_service.update_category(category_id, request.json)
