from app import db


class Budget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    category = db.relationship('Category', backref=db.backref('budgets', lazy=True))

    def __repr__(self):
        return f'<Budget {self.amount} for {self.category.name} from {self.start_date} to {self.end_date}>'
