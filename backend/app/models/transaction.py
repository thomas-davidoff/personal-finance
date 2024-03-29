from app import db
from datetime import datetime


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=True)
    account_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)

    def __repr__(self):
        return f"<Transaction {self.description} {self.amount}>"

    def to_dict(self, ids=True):
        dic = {
            "id": self.id,
            "date": (
                self.date.strftime('%m-%d-%Y') if self.date else None
            ),  # convert datetime to a string
            "description": self.description,
            "amount": self.amount,
        }
        if ids:
            dic.update(
                {"account_id": self.account_id, "category_id": self.category_id}
            )
        return dic
