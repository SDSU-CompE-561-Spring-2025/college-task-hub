from pydantic import BaseModel
from datetime import datetime

class RatingsBase(BaseModel):
    rating: int
    comment: str | None = None
    created_at: datetime

class RatingsCreate(RatingsBase):
    pass

class RatingsResponse(RatingsBase):
    id: int

    class Config:
        from_attributes = True
