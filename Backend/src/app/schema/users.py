from pydantic import BaseModel, constr, EmailStr, Field


class UsersBase(BaseModel):
    name: str
    email: EmailStr
    skills: str | None = None
    roles: str | None = None
    rating: int | None = None
    phone_number: str


class UsersCreate(BaseModel):
    name: str
    email: EmailStr
    password: constr(min_length=8, max_length=64)

#An internal schema you use when working with the DB
class Users(UsersBase):
    id: int = Field(..., gt=0)
    email: EmailStr

    class Config:
        from_attributes = True

class UsersResponse(UsersBase):
    id: int

    class Config:
        from_attributes = True

#Adding UsersUpdate for profile updates
class UsersUpdate(BaseModel):
    skills: str | None = None
    email: EmailStr
    phone_number: str
    name: str
    roles: str
    email: EmailStr
    phone_number: str
    rating: float

class ReviewIn(BaseModel):
    rating: int
    comment: str
    job_title: str
    giver_id: int
    receiver_id: int
