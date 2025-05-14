from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ApplicationBase(BaseModel):
    task_id: int

class ApplicationCreate(ApplicationBase):
    pass

class PerformerInfo(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    id: int
    performer_id: int
    created_at: datetime
    performer: PerformerInfo
    message: Optional[str] = None

    class Config:
        orm_mode = True
