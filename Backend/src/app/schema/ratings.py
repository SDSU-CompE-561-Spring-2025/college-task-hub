from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RatingsBase(BaseModel):
    rating: int
    comment: str | None = None
    created_at: datetime
    giver_id: int
    receiver_id: int

class RatingsCreate(RatingsBase):
    rating: int
    comment: str
    giver_id: int
    receiver_id: int
    created_at: Optional[datetime] = None

class RatingsResponse(RatingsBase):
    id: int

    class Config:
        from_attributes = True
