from flask import abort, jsonify
from app import db
from app.repositories.utils.constants import MODEL_NAMES

class BaseDAO:

    def __init__(self):
        self.session = db.session
        self.primary_model = None
        self.MODEL_NAMES = MODEL_NAMES

    def respond(self, data, status=200):
        """Prepare a standard JSON response."""
        response = jsonify(data)
        response.status_code = status
        return response

    def get_by_id(self, model_id):
        instance = self.primary_model.query.get(model_id)
        if not instance:
            abort(404, f'{self.primary_model.__name__} with ID {model_id} not found')
        return instance

    def get_all(self):
        return self.session.query(self.primary_model).all()


    # def get(self, transaction_id):
    #     transaction = self.get_by_id(self.primary_model, transaction_id)
    #     return self.respond(transaction.to_dict())
    #
    # def update(self, transaction_id, data):
    #     transaction = self.get_by_id(Transaction, transaction_id)
    #
    #     transaction.description = data.get('description', transaction.description)
    #     transaction.amount = data.get('amount', transaction.amount)
    #
    #     db.session.commit()
    #
    #     return self.respond(transaction.to_dict(), status=202)
