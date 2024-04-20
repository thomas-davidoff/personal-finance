from sqlalchemy import func
from sqlalchemy.orm.session import Session
from app.exceptions import RecordDoesNotExist


class BaseRepository:
    def __init__(self, model, db_session) -> None:
        self.db_session: Session = db_session
        self.model = model

    def _get_all_with_filter(self, filters={}):
        query = self.db_session.query(self.model)
        if filters:
            for filter_key, filter_value in filters.items():
                attr = getattr(self.model, filter_key)
                if isinstance(filter_value, list):
                    print(filter_value)
                    query = query.filter(func.upper(attr).in_(filter_value))
                else:
                    query = query.filter(func.upper(attr)==filter_value)
        return query

    def get_by_id(self, model_id):
        return self.db_session.query(self.model).get(model_id)

    def update_by_id(self, model_id, new_data):
        record = self.db_session.query(self.model).get(model_id)
        for attribute, new_value in new_data.items():
            setattr(record, attribute, new_value)
            self.db_session.commit()
        return record
    
    def delete_by_id(self, model_id):
        record = self.db_session.query(self.model).get(model_id)
        if not record:
            raise RecordDoesNotExist(f'Record with id {model_id} does not exist.', 404)
        self.db_session.delete(record)
        self.db_session.commit()
        return f'Record with id {model_id} deleted successfully.'
