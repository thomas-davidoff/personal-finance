from app import db
from sqlalchemy.orm import relationship


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.String(200), nullable=True)
    # categorized_transactions = db.relationship('Transaction', backref='category', lazy=True)
    transaction_type = db.Column(
        db.String(50), nullable=True
    )  # income, expense, investment, balance transfer, etc...
    transaction_subtype = db.Column(
        db.String(50), nullable=True, default=None
    )  # discretionary_spending, fixed_spending, salary, etc...
    transactions = relationship("Transaction", back_populates="category")

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
        }
        return data
