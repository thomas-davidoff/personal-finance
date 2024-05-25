from enum import Enum


# Define an Enum for the colors
class ColorEnum(Enum):
    grey = {
        "label": "Grey",
        "key": "grey",
        "foreground": "black",
        "background": "#8da3a6",
    }
    blue = {
        "label": "Blue",
        "key": "blue",
        "foreground": "white",
        "background": "#4186e0",
    }
    green = {
        "label": "Green",
        "key": "green",
        "foreground": "black",
        "background": "#62d26f",
    }
    orange = {
        "label": "Orange",
        "key": "orange",
        "foreground": "black",
        "background": "#fd612c",
    }
    yellow_orange = {
        "label": "Yellow orange",
        "key": "yellow_orange",
        "foreground": "black",
        "background": "#fd9a00",
    }
    yellow = {
        "label": "Yellow",
        "key": "yellow",
        "foreground": "black",
        "background": "#eec300",
    }
    yellow_green = {
        "label": "Yellow green",
        "key": "yellow_green",
        "foreground": "black",
        "background": "#a4cf30",
    }
    red = {
        "label": "Red",
        "key": "red",
        "foreground": "white",
        "background": "#e9445a",
    }
    blue_green = {
        "label": "Blue Green",
        "key": "blue_green",
        "foreground": "black",
        "background": "#37c5ab",
    }
    aqua = {
        "label": "Aqua",
        "key": "aqua",
        "foreground": "black",
        "background": "#20aaea",
    }
    indigo = {
        "label": "Indigo",
        "key": "indigo",
        "foreground": "black",
        "background": "#7a6ff0",
    }
    purple = {
        "label": "Purple",
        "key": "purple",
        "foreground": "black",
        "background": "#aa62e3",
    }
    magenta = {
        "label": "Magenta",
        "key": "magenta",
        "foreground": "black",
        "background": "#e56ce5",
    }
    hot_pink = {
        "label": "Hot Pink",
        "key": "hot_pink",
        "foreground": "black",
        "background": "#eb59a3",
    }
    pink = {
        "label": "Pink",
        "key": "pink",
        "foreground": "black",
        "background": "#fc91ad",
    }
    white = {
        "label": "White",
        "key": "white",
        "foreground": "black",
        "background": "#fff",
    }


MONTHS = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
}

CATEGORY_COLOR_DEFAULT = ColorEnum.grey.value["key"]


TRANSACTION_TYPES = ["income", "expense", "balance_transfer"]
