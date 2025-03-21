class RatingsBase(BaseModel):
    rating: int
    comment: str
    created_at: datetime

class RatingsCreate(ratingsBase):
    pass

class RatingsResponse(ratingsBase):
    id: int 

    class Config:
        from_attributes = True
