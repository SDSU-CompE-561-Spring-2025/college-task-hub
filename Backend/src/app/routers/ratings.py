from app.dependencies import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schema.ratings import RatingsCreate, RatingsResponse
from app.crud import ratings as crud_ratings
from app.middleware.logger import logger
from app.core.auth import get_current_user
from app.models.users import Users
from typing import List

router = APIRouter()
#Temporarily commenting this out for testing: current_user: Users = Depends(get_current_user)
@router.post("/rating",response_model=RatingsResponse)
async def create_rating(rating_data: RatingsCreate, db: Session = Depends(get_db), 
):
    """
    Create a new rating and add it to the database.
    rating_data: RatingCreate - The data for the new rating.
    Returns: A success message indicating the rating was created.
    """
    logger.info('Creating new rating')
    return crud_ratings.create_rating(db=db, rating_data=rating_data)

@router.get("/rating/{rating_id}",response_model=RatingsResponse)
async def get_rating(rating_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Return a list of all current ratings in the database.
    rating_id: int - The ID of the rating to retrieve.
    Returns: A specific rating.
    """
    logger.info('Requesting rating by ID')
    return crud_ratings.get_rating(db=db, rating_id=rating_id)

@router.put("/rating/{rating_id}",response_model=RatingsResponse)
async def update_rating(rating_id: int, rating_data: RatingsCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Update a single rating's information in the database.
    rating_id: int - The ID of the rating to update.
    rating_data: RatingCreate - The updated data for the rating.
    Returns: A success message indicating the rating was updated.
    """
    logger.info('Updating rating')
    return crud_ratings.update_rating(db=db, rating_id=rating_id, rating_data=rating_data)

@router.delete("/rating/{rating_id}",response_model=dict)
async def delete_rating(rating_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Delete a single rating from the database.
    rating_id: int - The ID of the rating to delete.
    Returns: A success message indicating the rating was deleted.
    """
    logger.info('Deleting rating')
    return crud_ratings.delete_rating(db=db, rating_id=rating_id)

#Adding so in profile we can see all ratings given to a user
@router.get("/ratings/{receiver_id}", response_model=List[RatingsResponse])
async def get_reviews_for_user(receiver_id: int, db: Session = Depends(get_db)):
    logger.info(f'Getting all reviews for user {receiver_id}')
    return crud_ratings.get_ratings_for_user(db=db, receiver_id=receiver_id)
