from app.core.database import Base
from sqlalchemy import Column, Integer, String

class Users(Base):
    '''
    ORM model for the users table
    '''
    __tablename__ = "users"
    # Testing
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, index=True, nullable=False)
    skills = Column(String, index=True, nullable=True)
    roles = Column(String, index=True, nullable=True)
    rating = Column(Integer, index=True, nullable=True)
    phone_number = Column(String, unique=True, index=True)
