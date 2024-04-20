from app import db


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    current_balance = db.Column(db.Float, nullable=False, default=0)
    starting_balance = db.Column(db.Float, nullable=False, default=0)
    account_type = db.Column(db.String(50))
    transactions = db.relationship('Transaction', back_populates='account')

    def __repr__(self):
        return f'<Account {self.name} Type: {self.account_type} Balance: {self.current_balance}>'

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "current_balance": self.current_balance,
            "starting_balance": self.starting_balance,
            "account_type": self.account_type,
            "num_transactions": len(self.transactions),
        }
