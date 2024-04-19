from app.models import Keyword
from app.repositories.base_repository import BaseRepository


class KeywordRepository(BaseRepository):
    def __init__(self, db_session) -> None:
        super().__init__(db_session=db_session, model=Keyword)

    def get_keyword_by_id(self, keyword_id) -> Keyword:
        return self.get_by_id(model_id=keyword_id)

    def get_all_keywords(self) -> Keyword.query_class:
        return self._get_all_with_filter()
    
    def create_keyword(self, keyword, label, category_id) -> Keyword:
        keyword = Keyword(keyword=keyword, category_id=category_id, label=label)
        self.db_session.add(keyword)
        self.db_session.commit()
        return keyword
    
    def delete_keyword(self, keyword_id):

        keyword = self.db_session.query(Keyword).get(keyword_id)
        assert keyword, f'Item with ID {keyword_id} not found.'
        self.db_session.delete(keyword)
        self.db_session.commit()
        return f'Item with id {keyword_id} deleted successfully.'
        
