from fastapi import APIRouter
from app.schema.ratings import RatingsCreate, RatingsResponse

router = APIRouter()

@router.post("/rating",response_model=RatingsResponse)
async def create_rating(rating_data: RatingsCreate):
    """
    Create a new rating and add it to the database.
    rating_data: RatingCreate - The data for the new rating.
    Returns: A success message indicating the rating was created.
    """
    return RatingsResponse(
        id=1,  # placeholder
        rating=rating_data.rating,
        comment=rating_data.comment,
        created_at=rating_data.created_at
    )

@router.get("/rating/{rating_id}",response_model=RatingsResponse)
async def get_ratings(rating_id: int):
    """
    Return a list of all current ratings in the database.
    rating_id: int - The ID of the rating to retrieve.
    Returns: A specific rating.
    """
    return RatingsResponse(
        id=rating_id,  # placeholder
        rating=5,
        comment="Would work with again!",
        created_at="2025-01-01T12:00:00"
    )

@router.put("/rating/{rating_id}",response_model=RatingsResponse)
async def update_rating(rating_id: int, rating_data: RatingsCreate):
    """
    Update a single rating's information in the database.
    rating_id: int - The ID of the rating to update.
    rating_data: RatingCreate - The updated data for the rating.
    Returns: A success message indicating the rating was updated.
    """
    return RatingsResponse(
        id=1,  # placeholder
        rating=rating_data.rating,
        comment=rating_data.comment,
        created_at=rating_data.created_at
    )

@router.delete("/rating/{rating_id}",response_model=dict)
async def delete_rating(rating_id: int):
    """
    Delete a single rating from the database.
    rating_id: int - The ID of the rating to delete.
    Returns: A success message indicating the rating was deleted.
    """
    return {"message": f"Rating with ID {rating_id} deleted"}
