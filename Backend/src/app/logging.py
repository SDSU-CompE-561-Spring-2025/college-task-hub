import logging
import sys

# make logger instance
logger = logging.getLogger()

# formats
formatter = logging.Formatter(
    fmt="%(message)"
)

# output handlers
stream_handler = logging.StreamHandler(sys.stdout)
file_handler = logging.FileHandler('app.log')

stream_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

logger.handlers = [stream_handler, file_handler]

logger.setLevel(logging.INFO)