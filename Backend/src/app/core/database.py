from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Gets the database URL from config.py

# Fetch variables
DBUSER = settings.DBUSER
PASSWORD = settings.PASSWORD
HOST = settings.HOST
PORT = settings.PORT
DBNAME = settings.DBNAME
SECRET_KEY = settings.SECRET_KEY

# Construct the SQLAlchemy connection string
DATABASE_URL = f"postgresql+psycopg2://{DBUSER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a Session object
# Session objects are used to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the base class for the ORM models
Base = declarative_base()
