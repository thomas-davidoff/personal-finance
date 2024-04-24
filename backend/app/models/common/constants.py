from enum import Enum


# Define an Enum for the colors
class ColorEnum(Enum):
    grey = "Grey"
    light_blue = "Light Blue"
    dark_blue = "Dark Blue"
    dark_red = "Red"
    dark_orange = "Dark Orange"
    light_orange = "Light Orange"
    light_green = "Light Green"
    dark_green = "Dark Green"
    light_yellow = "Light Yellow"

CATEGORY_COLOR_DEFAULT=ColorEnum.grey.value



TRANSACTION_TYPES = ["income", "expense", "balance_transfer"]
