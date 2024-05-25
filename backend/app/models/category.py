from app import db
from sqlalchemy.orm import relationship
from app.models.common import TRANSACTION_TYPES, CATEGORY_COLOR_DEFAULT
from sqlalchemy import CheckConstraint


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.String(200), nullable=True)
    transaction_type = db.Column(
        db.String(50),
        CheckConstraint(f"""transaction_type IN ({', '.join(f"'{t}'" for t in TRANSACTION_TYPES)})"""),
        nullable=True
    )
    transaction_subtype = db.Column(
        db.String(50), nullable=True, default=None
    )  # discretionary_spending, fixed_spending, salary, etc...
    transactions = relationship("Transaction", back_populates="category")
    # TODO: Make sure that the color is enforced. Ran into migrations issues with using sqlalchemy_utils
    color = db.Column(
        db.String(),
        nullable=True,
        default=CATEGORY_COLOR_DEFAULT
    )

    def __repr__(self):
        return f"<Category {self.name}>"

    def to_dict(self):
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "transaction_type": self.transaction_type,
            "transaction_subtype": self.transaction_subtype,
            "num_transactions": len(self.transactions),
            "color": self.color
        }
        return data
