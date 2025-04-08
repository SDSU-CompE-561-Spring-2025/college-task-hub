from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
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
    user_id = Column(Integer, ForeignKey('users.id'), index=True, nullable=False)
    task_id = Column(Integer, ForeignKey('tasks.id'), index=True, nullable=False)

    # Parent relationships
    # Reference users.py
    notifications_users_parent = relationship("Users", back_populates="notifications_users_child", foreign_keys=[user_id])
    # Reference tasks.py
    notifications_tasks_parent = relationship("Tasks", back_populates="notification_tasks_child", foreign_keys=[task_id])
