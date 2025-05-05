# crud/ratings.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.ratings import Ratings
from app.schema.ratings import RatingsCreate
from datetime import datetime


# (Create) Create new rating in the database
# This function takes a RatingsCreate object, creates a new Ratings object, adds it to the session, commits the session, and returns the created rating
def create_rating(db: Session, rating_data: RatingsCreate):
    data = rating_data.dict()
    if not data.get("created_at"):
        data["created_at"] = datetime.utcnow()
    db_rating = Ratings(**rating_data.dict())
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    return db_rating

# (Read) Get all ratings from the database
def get_rating(db: Session, rating_id: int):
    rating = db.query(Ratings).filter(Ratings.id == rating_id).first()
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    return rating

# (Update) Update a rating in the database
def update_rating(db: Session, rating_id: int, rating_data: RatingsCreate):
    rating = get_rating(db, rating_id)
    for field, value in rating_data.dict().items():
        setattr(rating, field, value)
    db.commit()
    db.refresh(rating)
    return rating

# (Delete) Delete a rating from the database
def delete_rating(db: Session, rating_id: int):
    rating = get_rating(db, rating_id)
    db.delete(rating)
    db.commit()
    return {"message": f"Rating with ID {rating_id} deleted"}

# (Read) Get all ratings for a specific user for profile
def get_ratings_for_user(db: Session, receiver_id: int):
    return db.query(Ratings).filter(Ratings.receiver_id == receiver_id).all()
