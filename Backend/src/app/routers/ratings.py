from fastapi import APIRouter
from pydantic import BaseModel

# This is used as a placeholder until schema models are implemented
class RatingCreate(BaseModel):
    user_id: int
    task_id: int
    rating: int

router = APIRouter()

@router.post("/rating")
async def create_rating(rating_data: RatingCreate):
    """
    Create a new rating and add it to the database.
    rating_data: RatingCreate - The data for the new rating.
    Returns: A success message indicating the rating was created.
    """
    return {"message": "Rating created", "Info": rating_data}

@router.get("/rating/{rating_id}")
async def get_ratings(rating_id: int):
    """
    Return a list of all current ratings in the database.
    rating_id: int - The ID of the rating to retrieve.
    Returns: A specific rating.
    """
    return {"message": f"Rating with ID {rating_id} retrieved"}

@router.put("/rating/{rating_id}")
async def update_rating(rating_id: int, rating_data: RatingCreate):
    """
    Update a single rating's information in the database.
    rating_id: int - The ID of the rating to update.
    rating_data: RatingCreate - The updated data for the rating.
    Returns: A success message indicating the rating was updated.
    """
    return {"message": f"Rating with ID {rating_id} updated", "data": rating_data}

@router.delete("/rating/{rating_id}")
async def delete_rating(rating_id: int):
    """
    Delete a single rating from the database.
    rating_id: int - The ID of the rating to delete.
    Returns: A success message indicating the rating was deleted.
    """
    return {"message": f"Rating with ID {rating_id} deleted"}
