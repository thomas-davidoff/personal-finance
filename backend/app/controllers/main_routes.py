from flask import Blueprint, render_template

main_bp = Blueprint('main_bp', __name__)


@main_bp.route('/', methods=['GET'])
def welcome():
    return render_template('home.html')

