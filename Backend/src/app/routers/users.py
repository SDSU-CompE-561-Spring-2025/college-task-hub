from app.schema.users import UsersCreate, UsersResponse
from app.crud import users as crud_users
from app.dependencies import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/user", response_model=UsersResponse)
async def create_user(user_data: UsersCreate,db: Session = Depends(get_db)):
    """"
    Create a new user and add it to the database.
    user_data: UserCreate - The data for the new user.
    Returns: A success message indicating the user was created.
    """
    return crud_users.create_user(db=db, user_data=user_data)

@router.get("/user",response_model=list[UsersResponse])
async def get_users(db: Session = Depends(get_db)):
    """"
    Return a list of all current users in the database.
    Returns: A list of users.
    """
    return crud_users.get_users(db=db)

@router.put("/user/{user_id}",response_model=UsersResponse)
async def update_user(user_id: int, user_data: UsersCreate,db: Session = Depends(get_db)):
    """"
    Update a single user's information in the database.
    user_id: int - The ID of the user to update.
    user_data: UserCreate - The updated data for the user.
    Returns: A success message indicating the user was updated.
    """
    return crud_users.update_user(db=db, user_id=user_id, user_data=user_data)

@router.delete("/user/{user_id}",response_model=dict)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """"
    Delete a single user from the database.
    user_id: int - The ID of the user to delete.
    Returns: A success message indicating the user was deleted.
    """
    return crud_users.delete_user(db=db, user_id=user_id)
