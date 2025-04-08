from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
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
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), index=True, nullable=False)

    # Child relationships
    # Reference notifications.py
    notification_tasks_child = relationship("Notifications", back_populates="notifications_tasks_parent")

    # Parent relationships
    # Reference users.py
    tasks_users_parent = relationship("Users", back_populates="tasks_users_child", foreign_keys=[user_id])
    # Reference locations.py
    tasks_location_parent = relationship("Locations", back_populates="locations_tasks_child",
                                        foreign_keys=[location_id])
