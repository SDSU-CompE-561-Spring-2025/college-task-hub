from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TasksBase(BaseModel):
    title: str
    description: str
    status: str | None = None
    price: int = Field(gt=0, description="Price must be greater than 0")
    duration: Optional[str] = None
    category: str | None = None
    avatar: str | None = None
    user_id: int
    location_id: int

class TasksCreate(TasksBase):
    pass

class TasksResponse(TasksBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
