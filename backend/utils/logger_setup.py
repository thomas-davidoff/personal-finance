# logger_setup.py

import logging
from colorama import Fore, Style



class CustomFormatter(logging.Formatter):
    """Logging Formatter to add colors and count warning / errors"""

    format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s (%(filename)s:%(lineno)d)"

    FORMATS = {
        logging.DEBUG: Fore.CYAN + format + Style.RESET_ALL,
        logging.INFO: Fore.GREEN + format + Style.RESET_ALL,
        logging.WARNING: Fore.YELLOW + format + Style.RESET_ALL,
        logging.ERROR: Fore.RED + format + Style.RESET_ALL,
        logging.CRITICAL: Fore.RED + Style.BRIGHT + format + Style.RESET_ALL
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


def setup_logger():
    # Configure logger
    logging.basicConfig(level=logging.DEBUG)

    # Apply custom formatter
    for handler in logging.root.handlers:
        handler.setFormatter(CustomFormatter())


setup_logger()
log_name = 'finance'
logger = logging.getLogger(log_name)

logger.debug(f'initializing log as {log_name}')