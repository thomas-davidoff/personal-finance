from flask import Blueprint, render_template
import pandas as pd
import json
from app.services import transaction_service
from datetime import datetime

main_bp = Blueprint("main_bp", __name__)


def parse_date(date_str):
    for fmt in ("%m/%d/%Y", "%m/%d/%y", ""):  # Add or modify formats as needed
        try:
            return pd.to_datetime(date_str, format=fmt)
        except ValueError:
            continue
    return pd.NaT  # Return pd.NaT if all formats fail


@main_bp.route("/", methods=["GET"])
def welcome():
    return render_template("home.html")


@main_bp.route("/import_amex")
def import_amex():
    df = pd.read_csv("data/amex.csv")
    df = df.rename(
        columns={col: col.lower().replace(" ", "_") for col in list(df.columns)}
    )
    df["account_id"] = 1
    df = df[["date", "description", "amount", "account_id"]]
    df["date"] = df["date"].apply(parse_date)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["amount"] = df["amount"] * -1

    amex_transactions = json.loads(df.to_json(orient="records"))
    for transaction in amex_transactions:
        date = datetime.utcfromtimestamp(transaction["date"] / 1000)
        kwargs = {**transaction, "date": date}
        transaction_service.add_transaction(**kwargs)


@main_bp.route("/import_bofa")
def import_bofa():
    df = pd.read_csv("data/bofa.csv")
    df["account_id"] = 2
    df = df.rename(
        columns={col: col.lower().replace(" ", "_") for col in list(df.columns)}
    )
    df["date"] = df["date"].apply(parse_date)
    df["amount"] = pd.to_numeric(df["amount"].str.replace(",", ""), errors="coerce")
    df = df[["date", "description", "amount", "account_id"]]
    bofa_transactions = json.loads(df.to_json(orient="records"))
    for transaction in bofa_transactions:
        date = datetime.utcfromtimestamp(transaction["date"] / 1000)
        kwargs = {**transaction, "date": date}
        transaction_service.add_transaction(**kwargs)
