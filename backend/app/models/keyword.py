from app import db


class Keyword(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(150), nullable=False, unique=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    category = db.relationship('Category', backref=db.backref('keywords', lazy=True))

    def __repr__(self):
        return f'<Keyword {self.keyword} linked to category {self.category_id}>'
