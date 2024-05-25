from app import db
from datetime import datetime
from sqlalchemy.orm import relationship


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category_id = db.Column(
        db.Integer, db.ForeignKey("category.id"), nullable=False, default=1
    )
    account_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)
    account = db.relationship("Account", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction {self.description} {self.amount}>"

    def to_dict(self):
        """
        # TODO: Returns a compact resource by default - must provide keys if wanting to expand
        """
        dic = {
            "id": self.id,
            "date": (self.date.strftime("%Y-%m-%d") if self.date else None),
            "description": self.description,
            "amount": self.amount,
            "account": (
                {k: v for k, v in self.account.to_dict().items() if k in ["id", "name"]}
                if self.account
                else None
            ),
            "category": (
                {
                    k: v
                    for k, v in self.category.to_dict().items()
                    if k in ["id", "name", "color"]
                }
                if self.category
                else None
            ),
        }
        return dic
