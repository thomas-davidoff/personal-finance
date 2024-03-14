from app.repositories.repositories import BaseDAO
from app.models import Category
from app.utils import QueryFilter


class CategoryDAO(BaseDAO):

    def __init__(self):
        super().__init__()
        self.primary_model = Category

    @staticmethod
    def _apply_filters(query, filter_object: QueryFilter):
        return query

    def get_categories(self, query_filter):
        query = self.session.query(Category)
        query = self._apply_filters(query, query_filter)
        return query.all()


category_dao = CategoryDAO()
