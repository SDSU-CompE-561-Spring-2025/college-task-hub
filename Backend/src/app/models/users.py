from app.core.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Users(Base):
    '''
    ORM model for the users table
    '''
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, index=True, nullable=False)
    skills = Column(String, index=True, nullable=True)
    roles = Column(String, index=True, nullable=True)
    rating = Column(Integer, index=True, nullable=True)
    phone_number = Column(String, unique=True, index=True)


    # Child relationships
    # Reference notifications.py
    notifications_users_child = relationship("Notifications", back_populates="notifications_users_parent")
    # Reference ratings.py
    ratings_giver_child = relationship("Ratings", back_populates="ratings_giver_parent",
                                        foreign_keys="Ratings.giver_id")
    ratings_receiver_child = relationship("Ratings", back_populates="ratings_receiver_parent",
                                        foreign_keys="Ratings.receiver_id")
    # Reference tasks.py
    tasks_users_child = relationship("Tasks", back_populates="tasks_users_parent")

    # applications reference
    applications = relationship("Applications", back_populates="performer", cascade="all, delete-orphan")
