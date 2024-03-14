from typing import Tuple
from datetime import datetime, timedelta


def get_start_and_end_from_month_year(month, year) -> Tuple[datetime, datetime]:
    start_date = datetime(year, month, 1)
    end_date = (
        datetime(year, month + 1, 1) - timedelta(days=1)
        if month < 12
        else datetime(year + 1, 1, 1) - timedelta(days=1)
    )
    return start_date, end_date
