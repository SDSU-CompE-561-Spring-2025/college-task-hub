from pydantic import BaseModel, constr, EmailStr, Field, validator
from typing import Optional


class UsersBase(BaseModel):
    name: constr(min_length=2, max_length=100)
    email: EmailStr
    skills: str | None = None
    roles: str | None = None
    rating: int | None = None
    phone_number: str | None = None

    @validator('name')
    def validate_name(cls, v):
        parts = v.strip().split()
        if len(parts) < 2:
            raise ValueError('Name must include both first and last name')
        if any(len(part) < 2 for part in parts):
            raise ValueError('Each name part must be at least 2 characters long')
        if any(not part.isalpha() for part in parts):
            raise ValueError('Name can only contain letters')
        return v


class UsersCreate(BaseModel):
    name: constr(min_length=2, max_length=64)
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
    name: constr(min_length=2, max_length=100)
    roles: str
    email: EmailStr
    phone_number: str | None = None
    rating: float

class ReviewIn(BaseModel):
    rating: int
    comment: str
    job_title: str
    giver_id: int
    receiver_id: int

class UsersCreatedResponse(BaseModel):
    id: int 
    name: constr(min_length=2, max_length=100)
    email: EmailStr
    class Config:
        from_attributes = True

class UserSignIn(BaseModel):
    email: EmailStr
    password: str
    grant_type: str = "password"
    scope: str = ""
    client_id: Optional[str] = None
    client_secret: Optional[str] = None
