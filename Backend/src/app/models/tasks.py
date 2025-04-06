from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import UTC, datetime

class Tasks(Base):
    '''
    ORM model for the tasks table
    '''
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, index=True, nullable=False)
    status = Column(String, index=True, nullable=True)
    price = Column(Integer, index=True, nullable=False)
    created_at = Column(DateTime, index=True, nullable=False, default=datetime.now(UTC))

    # Foreign keys
    user_id = Column(Integer, foreign_key=True, index=True, nullable=False)
    location_id = Column(Integer, foreign_key=True, index=True, nullable=False)
