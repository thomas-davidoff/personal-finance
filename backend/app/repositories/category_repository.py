from app.models import Category
from app.repositories.base_repository import BaseRepository
from sqlalchemy import func


class CategoryRepository(BaseRepository):
    def __init__(self, db_session) -> None:
        super().__init__(db_session=db_session, model=Category)

    def get_categories(self, filters: dict = {}) -> Category.query_class:
        return self._get_all_with_filter(filters)

    def get_category(self, category_id=None, name=None) -> Category:
        if category_id is None:
            assert name, "must provide a name if not providing an id"

            return self._get_all_with_filter(filters={"name": name}).first()
        else:
            return self.get_by_id(model_id=category_id)

    def create_category(self, data):
        category = Category(**data)
        self.db_session.add(category)
        self.db_session.commit()
        return category
