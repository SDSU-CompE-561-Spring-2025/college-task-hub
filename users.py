from pydantic import BaseModel, constr, EmailStr, Field


class UsersBase(BaseModel):
    name: str
    email: EmailStr
    skills: str | None = None
    roles: str | None = None
    rating: int | None = None
    phone_number: str


class UsersCreate(UsersBase):
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
