from app import db


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    current_balance = db.Column(db.Float, nullable=False, default=0)
    starting_balance = db.Column(db.Float, nullable=False, default=0)
    account_type = db.Column(db.String(50))  # e.g., 'Checking', 'Savings', 'Credit Card'
    transactions = db.relationship('Transaction', backref='account', lazy=True)

    def __repr__(self):
        return f'<Account {self.name} Type: {self.account_type} Balance: {self.current_balance}>'
