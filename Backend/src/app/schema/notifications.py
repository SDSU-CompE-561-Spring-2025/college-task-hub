from pydantic import BaseModel
from datetime import datetime

class NotificationsBase(BaseModel):
    title: str
    message: str
    created_at:datetime

class NotificationsCreate(NotificationsBase):
    pass

class NotificationsResponse(NotificationsBase):
    id: int

    class Config:
        from_attributes = True
