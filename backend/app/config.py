import os

file_path = os.path.abspath(os.getcwd()) + "/data/finance.db"


class Config(object):
    # Database configuration
    SQLALCHEMY_DATABASE_URI = "sqlite:////" + file_path
    SQLALCHEMY_TRACK_MODIFICATIONS = False
