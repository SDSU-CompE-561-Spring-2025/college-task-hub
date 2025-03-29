from pydantic import BaseModel

class LocationsBase(BaseModel):
    street: str
    city: str
    state: str
    zipcode: int


class LocationsCreate(LocationsBase):
    pass


class LocationsResponse(LocationsBase):
    id: int

    class Config:
        from_attributes = True

