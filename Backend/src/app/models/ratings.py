from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, UTC

class Ratings(Base):
    '''
    ORM model for the ratings table
    '''
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, index=True, nullable=False)
    comment = Column(String, index=True, nullable=True)
    #created_at = Column(DateTime, index=True, nullable=False, default=datetime.now(UTC))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Foreign keys
    giver_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)

    # Parent relationships
    ratings_giver_parent = relationship("Users", back_populates="ratings_giver_child", foreign_keys=[giver_id])
    ratings_receiver_parent = relationship("Users", back_populates="ratings_receiver_child", foreign_keys=[receiver_id])
