from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configuration
app.config.from_object("app.config.Config")

# Initialize database
db = SQLAlchemy(app)

# Import models so that they are registered with SQLAlchemy
from app.models import Transaction, Account, Category, Keyword

# Import controllers
from app.controllers import (
    transaction_bp,
    main_bp,
    account_bp,
    category_bp,
    monthly_kpi_bp,
    keyword_bp,
)

app.register_blueprint(main_bp)
app.register_blueprint(transaction_bp, url_prefix="/transactions")
app.register_blueprint(account_bp, url_prefix="/accounts")
app.register_blueprint(category_bp, url_prefix="/categories")
app.register_blueprint(monthly_kpi_bp, url_prefix="/monthly_kpis")
app.register_blueprint(keyword_bp, url_prefix="/keywords")
