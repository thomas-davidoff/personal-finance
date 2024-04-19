from app import app
from flask import jsonify
from .exceptions import RecordDoesNotExist


@app.errorhandler(RecordDoesNotExist)
def handle_record_does_not_exist(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
