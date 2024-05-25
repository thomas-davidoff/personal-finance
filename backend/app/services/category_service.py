# Import necessary modules and classes
from utils import logger
from app.repositories import (
    category_repository,
    keyword_repository,
    transaction_repository,
)
import re
from app.models.common import ColorEnum
from app.exceptions import ValidationError


class CategoryService:
    def __init__(self):
        logger.info("Initializing category service...")

    def list_categories(self, filters={}):
        query = category_repository.get_categories(filters)

        categories = query.all()

        return [c.to_dict() for c in categories]

    def list_transactions(self, category_id):
        category = category_repository.get_category(category_id=category_id)
        assert category, "Category not found"
        return [t.to_dict() for t in category.transactions]

    def get_category(self, category_id=None, category_name=None):
        if isinstance(category_name, str):
            category_name = category_name.upper()
        category = category_repository.get_category(
            category_id=category_id, name=category_name
        ).to_dict()
        return category

    def get_category_id_from_name(self, category_string):
        return category_repository.get_category()

    def list_keywords(self):
        query = keyword_repository.get_all_keywords()
        return [k.to_dict() for k in query]

    def categorize_transactions(self, only_uncategorized=True):
        uncategorized = self.get_category(category_name="uncategorized")
        uncategorized_id = uncategorized["id"]
        uncategorized = transaction_repository.get_transactions(
            category_id=uncategorized_id
        ).all()
        if only_uncategorized:
            all_transactions = uncategorized
        else:
            all_transactions = transaction_repository.get_transactions().all()
        all_keywords = keyword_repository.get_all_keywords()

        updated = []
        updated_ids = set()
        warnings = []

        for transaction in all_transactions:
            normalized_description = re.sub(
                "[^a-zA-Z]+", "*", transaction.description
            ).lower()
            print(normalized_description)
            parts = normalized_description.split("*")
            for keyword in all_keywords:
                kw_parts = keyword.keyword.split("|")
                if all([kw_part in parts for kw_part in kw_parts]):
                    before_category = transaction.category.name
                    before_category_id = transaction.category_id
                    if before_category_id != keyword.category_id:
                        if transaction.id in updated_ids:
                            warning = f"\
                                transaction with id {transaction.id} was already updated. \
                                description: {transaction.description}, keyword: {keyword.keyword}"
                            logger.warn(warning)
                            warnings.append(warning)
                            continue

                        # update transaction category
                        transaction = transaction_repository.update_transaction(
                            transaction_id=transaction.id,
                            new_transaction_data={"category_id": keyword.category_id},
                        )
                        after_category = category_repository.get_category(
                            keyword.category_id
                        ).name
                        updated.append(
                            {
                                "transaction_id": transaction.id,
                                "transaction_description": transaction.description,
                                "before_category": before_category,
                                "after_category": after_category,
                                "keyword_used": keyword.keyword,
                            }
                        )
                        updated_ids.add(transaction.id)

        return {
            "before_uncategorized": len(uncategorized),
            "total_transactions": len(all_transactions),
            "total_updated": len(updated),
            "updated": updated,
            "warnings": warnings,
            "after_uncategorized": len(uncategorized) - len(updated),
        }

    def add_keyword(self, keyword, category_id, label=None):
        keyword = keyword_repository.create_keyword(
            keyword=keyword, label=label, category_id=category_id
        )
        return keyword.to_dict()

    def delete_keyword(self, keyword_id):
        return keyword_repository.delete_keyword(keyword_id)

    def get_keyword(self, keyword_id) -> dict:
        return keyword_repository.get_by_id(model_id=keyword_id).to_dict()

    def delete_category(self, category_id):
        deleted_transaction_message = category_repository.delete_by_id(
            model_id=category_id
        )
        return deleted_transaction_message

    def add_category(self, data):
        category = category_repository.create_category(
            self._validate_new_category_data(data)
        )
        return category.to_dict()

    def update_category(self, category_id, data):
        updated_category = category_repository.update_by_id(
            model_id=category_id, new_data=self._validate_new_category_data(data)
        )
        return updated_category.to_dict()

    def _validate_new_category_data(self, data):
        return {
            **data,
            "color": self._get_category_color(data.get("color")),
        }

    def _get_category_color(self, color_string):
        if color_string is None:
            return color_string
        try:
            return ColorEnum[color_string].value['key']
        except KeyError:
            raise ValidationError(
                f'color: {color_string} does not exist. It must be one of: {", ".join(list(ColorEnum.__members__))}',
                400,
            )
