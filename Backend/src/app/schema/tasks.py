from pydantic import BaseModel, Field
from datetime import datetime

class TasksBase(BaseModel):
    title: str
    description: str
    status: str | None = None
    price: int = Field(gt=0, description="Price must be greater than 0")
    created_at: datetime
    user_id: int
    location_id: int

class TasksCreate(TasksBase):
    pass

class TasksResponse(TasksBase):
    id: int

    class Config:
        from_attributes = True
