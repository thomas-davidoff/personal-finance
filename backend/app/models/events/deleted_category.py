from sqlalchemy import event
from sqlalchemy.orm import Session
from app.models import Category, Keyword, Transaction

@event.listens_for(Session, 'before_flush')
def set_default_parent_id(session, flush_context, instances):
    for instance in session.deleted:
        if isinstance(instance, Category):
            session.query(Keyword).filter(Keyword.category_id == instance.id).delete()
            session.query(Transaction).filter(Transaction.category_id == instance.id).update({'category_id': 1})
