from flask import Blueprint, jsonify, request, abort
from app import db
from app.models import Category
from app.services.category_service import category_service
from app.utils import QueryFilter

category_bp = Blueprint("category_bp", __name__)


@category_bp.route("/", methods=["GET"])
def get_categories():
    # check for allowed params
    expected_params = set()
    unexpected_params = set(request.args.keys()) - expected_params
    if unexpected_params:
        abort(400, description=f"Unexpected parameters: {', '.join(unexpected_params)}")
    query_filter = QueryFilter()
    return category_service.get_categories(query_filter)
