from datetime import datetime

class QueryFilter:
    def __init__(self, start_date=None, end_date=None):
        self.start_date = start_date or datetime(1970, 1, 1)
        self.end_date = end_date or datetime(9999, 12, 31)
        self.conditions = []

    def add_condition(self, field, value, operator):
        val = value
        if isinstance(value, list):
            val = [v.upper() for v in value]
        elif isinstance(value, str):
            val = value.upper()
        self.conditions.append(dict(field=field, value=val, operator=operator))