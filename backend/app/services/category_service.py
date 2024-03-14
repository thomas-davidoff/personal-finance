# Import necessary modules and classes
from utils import logger
from app.repositories.repositories.category_DAO import category_dao



class CategoryService:
    def __init__(self):
        logger.info('Initializing category service...')

    def get_categories(self, query_filter):
        return [c.to_dict() for c in category_dao.get_categories(query_filter)]

category_service = CategoryService()