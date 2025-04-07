from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, UTC

class Notifications(Base):
    '''
    ORM model for the notifications table
    '''
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    message = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, index=True, nullable=False, default=datetime.now(UTC))

    # Foreign keys
    user_id = Column(Integer, foreign_key=True, index=True, nullable=False)
    task_id = Column(Integer, foreign_key=True, index=True, nullable=False)
