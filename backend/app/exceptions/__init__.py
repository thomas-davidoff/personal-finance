from app import app
from flask import jsonify
from .exceptions import RecordDoesNotExist, ValidationError
from sqlalchemy.exc import IntegrityError
from utils import logger
import re


@app.errorhandler(RecordDoesNotExist)
def handle_record_does_not_exist(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.errorhandler(IntegrityError)
def handle_integrity_error(error: IntegrityError):
    logger.error(f"Integrity Error: {str(error.orig)}")
    match = re.search(r"UNIQUE constraint failed: (\w+)\.(\w+)", str(error.orig))
    if match:
        table_name, column_name = match.groups()
        human_readable_error = f"The {column_name.replace('_', ' ')} must be unique."
        return jsonify(error=human_readable_error), 400
    else:
        return (
            jsonify(error="An unexpected database error occurred. Please try again."),
            400,
        )


@app.errorhandler(ValidationError)
def handle_record_does_not_exist(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
