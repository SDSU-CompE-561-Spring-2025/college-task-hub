from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Applications(Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("task_id", "performer_id", name="uq_task_performer"),
    )

    id           = Column(Integer, primary_key=True, index=True)
    task_id      = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    performer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at   = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # relationships
    task      = relationship("Tasks", back_populates="applications")
    performer = relationship("Users", back_populates="applications")
