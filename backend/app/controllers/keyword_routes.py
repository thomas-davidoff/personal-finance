from flask import Blueprint, jsonify, request, abort
from app import db
from app.models import Category
from app.services import category_service
from app.utils import QueryFilter

keyword_bp = Blueprint("keyword_bp", __name__)


@keyword_bp.route("/", methods=["GET"])
def list_keywords():
    return category_service.list_keywords()


@keyword_bp.route("/", methods=["POST"])
def create_keyword():
    keyword_data = request.json

    keyword = category_service.add_keyword(
        keyword=keyword_data.get("keyword"),
        category_name=keyword_data.get("category"),
        label=keyword_data.get("label"),
    )

    return keyword


@keyword_bp.route("/<int:keyword_id>", methods=["DELETE"])
def delete_keyword(keyword_id):
    try:
        message = category_service.delete_keyword(keyword_id)
        return jsonify({"message": message}), 200
    except AssertionError as e:
        return jsonify({"message": str(e)}), 404


@keyword_bp.route("/<int:keyword_id>", methods=["GET"])
def get_a_keyword(keyword_id):
    keyword = category_service.get_keyword(keyword_id)
    return jsonify(keyword), 200
