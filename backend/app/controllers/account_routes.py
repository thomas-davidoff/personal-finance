from flask import Blueprint, jsonify
from app import db
from app.models import Account

account_bp = Blueprint('account_bp', __name__)


@account_bp.route('/accounts', methods=['GET'])
def get_accounts():
    accounts = db.session.query(Account).get_all()
    return jsonify([{'id': a.id, 'name': a.name, 'type': a.account_type, 'current_balance': a.current_balance,
                     'starting_balance': a.starting_balance} for a in accounts])
