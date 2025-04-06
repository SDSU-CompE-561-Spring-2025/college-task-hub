from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, UTC

class Ratings(Base):
    '''
    ORM model for the ratings table
    '''
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, index=True, nullable=False)
    comment = Column(String, index=True, nullable=True)
    created_at = Column(DateTime, index=True, nullable=False, default=datetime.now(UTC))

    # Foreign keys
    giver_id = Column(Integer, foreign_key=True, unique=True, index=True, nullable=False)
    reciever_id = Column(Integer, foreign_key=True, unique=True, index=True, nullable=False)
