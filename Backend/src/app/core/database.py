from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Gets the database URL from config.py
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# Create an engine
# Engine is responsible for managing the connection to the database
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a Session object
# Session objects are used to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the base class for the ORM models
Base = declarative_base()
