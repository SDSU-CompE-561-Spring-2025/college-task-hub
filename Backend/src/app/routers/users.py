from app.schema.users import UsersCreate, UsersResponse, UsersCreatedResponse
from app.crud import users as crud_users
from app.dependencies import get_db
from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_current_user
from app.schema.token import Token
from fastapi import HTTPException, status
from datetime import timedelta
from app.middleware.logger import logger
from app.models.users import Users
from app.schema.users import UsersUpdate
import os

router = APIRouter()

@router.post("/user", response_model=UsersCreatedResponse)
async def create_user(user_data: UsersCreate, db: Session = Depends(get_db)):
    """"
    Create a new user and add it to the database.
    user_data: UserCreate - The data for the new user.
    Returns: A success message indicating the user was created.
    """
    logger.info('Creating new user')
    return crud_users.create_user(db=db, user_data=user_data)

@router.post("/user/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud_users.authenticate_user(db, email=form_data.username, password=form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.name}, expires_delta=access_token_expires)

    logger.info('Checking access token')
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/user",response_model=list[UsersResponse])
async def get_users(db: Session = Depends(get_db)):
    """add this back after testing: , current_user: Users = Depends(get_current_user)"""
    """"
    Return a list of all current users in the database.
    Returns: A list of users.
    """
    logger.info('Requesting list of users')
    return crud_users.get_users(db=db)

@router.get("/user/{user_id}", response_model=UsersResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """ add this back in after testing: , current_user: Users = Depends(get_current_user)"""
    """"
    Return a single user by their ID.
    user_id: int - The ID of the user to retrieve.
    Returns: The user if found, otherwise raises a 404 error.
    """
    logger.info('Requesting user by ID')
    return crud_users.get_user(db=db, user_id=user_id)

@router.put("/user/{user_id}",response_model=UsersResponse)
# I changed this to UsersCreate from UsersUpdate so the profile updates don't requre a password
async def update_user(user_id: int, user_data: UsersUpdate, db: Session = Depends(get_db),current_user: Users = Depends(get_current_user)):
    """"
    Update a single user's information in the database.
    user_id: int - The ID of the user to update.
    user_data: UserCreate - The updated data for the user.
    Returns: A success message indicating the user was updated.
    """
    logger.info('Updating user')
    return crud_users.update_user(db=db, user_id=user_id, user_data=user_data)

@router.delete("/user/{user_id}",response_model=dict)
async def delete_user(user_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """"
    Delete a single user from the database.
    user_id: int - The ID of the user to delete.
    Returns: A success message indicating the user was deleted.
    """
    logger.info('Deleting user')
    return crud_users.delete_user(db=db, user_id=user_id)

@router.post("/upload-profile-pic/")
async def upload_profile_pic(user_id: int, file: UploadFile = File(...)):
    # Make sure directory exists
    os.makedirs("media/profile_images", exist_ok=True)

    # Save the file
    file_path = f"media/profile_images/{user_id}.jpg"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    return {"filename": file.filename}
