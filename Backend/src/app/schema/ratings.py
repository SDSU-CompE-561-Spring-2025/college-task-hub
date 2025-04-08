from pydantic import BaseModel
from datetime import datetime

class RatingsBase(BaseModel):
    rating: int
    comment: str | None = None
    created_at: datetime
    giver_id: int
    receiver_id: int

class RatingsCreate(RatingsBase):
    pass

class RatingsResponse(RatingsBase):
    id: int

    class Config:
        from_attributes = True
