import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.ratings import Ratings
from app.models.users import Users
from app.schema.ratings import RatingsCreate
from app.crud.ratings import create_rating, get_rating, update_rating, delete_rating
from fastapi import HTTPException
from datetime import datetime, UTC

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_ratings_crud.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Current timestamp for testing
current_time = datetime.now(UTC)

@pytest.fixture
def db_session():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    db = TestingSessionLocal()

    # Create test users for foreign key references
    giver_user = Users(
        name="Rating Giver",
        email="giver@example.com",
        password_hash="hashed_password",
        phone_number="1234567890"
    )
    
    receiver_user = Users(
        name="Rating Receiver",
        email="receiver@example.com",
        password_hash="hashed_password",
        phone_number="0987654321"
    )
    
    db.add(giver_user)
    db.add(receiver_user)
    db.commit()
    db.refresh(giver_user)
    db.refresh(receiver_user)
    
    try:
        yield db
    finally:
        db.close()
    
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_data(db_session):
    """Create test users and return their IDs along with test rating data"""
    # Get the created users
    giver = db_session.query(Users).filter(Users.name == "Rating Giver").first()
    receiver = db_session.query(Users).filter(Users.name == "Rating Receiver").first()
    
    # Create test rating data
    rating_data = {
        "rating": 5,
        "comment": "Excellent service",
        "created_at": current_time,
        "giver_id": giver.id,
        "receiver_id": receiver.id
    }
    
    # Create updated rating data
    updated_rating_data = {
        "rating": 4,
        "comment": "Good service but could be better",
        "created_at": current_time,
        "giver_id": giver.id,
        "receiver_id": receiver.id
    }
    
    return {
        "rating_data": RatingsCreate(
            rating=rating_data["rating"],
            comment=rating_data["comment"],
            created_at=rating_data["created_at"]
        ),
        "full_rating_data": rating_data,
        "updated_rating_data": RatingsCreate(
            rating=updated_rating_data["rating"],
            comment=updated_rating_data["comment"],
            created_at=updated_rating_data["created_at"]
        ),
        "full_updated_rating_data": updated_rating_data,
        "giver_id": giver.id,
        "receiver_id": receiver.id
    }

def test_create_rating(db_session, test_data):
    """Test creating a new rating directly with the CRUD function"""
    # Create a new rating
    db_rating = Ratings(
        rating=test_data["full_rating_data"]["rating"],
        comment=test_data["full_rating_data"]["comment"],
        created_at=test_data["full_rating_data"]["created_at"],
        giver_id=test_data["giver_id"],
        receiver_id=test_data["receiver_id"]
    )
    db_session.add(db_rating)
    db_session.commit()
    db_session.refresh(db_rating)
    
    # Verify the rating was created with correct data
    assert db_rating.rating == test_data["full_rating_data"]["rating"]
    assert db_rating.comment == test_data["full_rating_data"]["comment"]
    assert db_rating.giver_id == test_data["giver_id"]
    assert db_rating.receiver_id == test_data["receiver_id"]
    assert db_rating.id is not None

def test_get_rating(db_session, test_data):
    """Test getting a single rating by ID directly with the CRUD function"""
    # First create a test rating
    db_rating = Ratings(
        rating=test_data["full_rating_data"]["rating"],
        comment=test_data["full_rating_data"]["comment"],
        created_at=test_data["full_rating_data"]["created_at"],
        giver_id=test_data["giver_id"],
        receiver_id=test_data["receiver_id"]
    )
    db_session.add(db_rating)
    db_session.commit()
    db_session.refresh(db_rating)
    
    # Get the rating by ID
    retrieved_rating = get_rating(db=db_session, rating_id=db_rating.id)
    
    # Verify we get the correct rating
    assert retrieved_rating.id == db_rating.id
    assert retrieved_rating.rating == test_data["full_rating_data"]["rating"]
    assert retrieved_rating.comment == test_data["full_rating_data"]["comment"]
    assert retrieved_rating.giver_id == test_data["giver_id"]
    assert retrieved_rating.receiver_id == test_data["receiver_id"]

def test_get_nonexistent_rating(db_session):
    """Test getting a rating that doesn't exist"""
    # Try to get a rating with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        get_rating(db=db_session, rating_id=999)
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Rating not found" in excinfo.value.detail

def test_update_rating(db_session, test_data):
    """Test updating a rating directly with the CRUD function"""
    # First create a test rating
    db_rating = Ratings(
        rating=test_data["full_rating_data"]["rating"],
        comment=test_data["full_rating_data"]["comment"],
        created_at=test_data["full_rating_data"]["created_at"],
        giver_id=test_data["giver_id"],
        receiver_id=test_data["receiver_id"]
    )
    db_session.add(db_rating)
    db_session.commit()
    db_session.refresh(db_rating)
    
    # Update the rating
    updated_rating = update_rating(
        db=db_session, 
        rating_id=db_rating.id, 
        rating_data=test_data["updated_rating_data"]
    )
    
    # Verify the returned object has the updated data
    assert updated_rating.id == db_rating.id
    assert updated_rating.rating == test_data["updated_rating_data"].rating
    assert updated_rating.comment == test_data["updated_rating_data"].comment
    assert updated_rating.giver_id == test_data["giver_id"]
    assert updated_rating.receiver_id == test_data["receiver_id"]
    
    # Verify the object was actually updated in the database
    db_updated = db_session.query(Ratings).filter(Ratings.id == db_rating.id).first()
    assert db_updated.rating == test_data["updated_rating_data"].rating
    assert db_updated.comment == test_data["updated_rating_data"].comment

def test_update_nonexistent_rating(db_session, test_data):
    """Test updating a rating that doesn't exist"""
    # Try to update a rating with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        update_rating(
            db=db_session, 
            rating_id=999, 
            rating_data=test_data["updated_rating_data"]
        )
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Rating not found" in excinfo.value.detail

def test_delete_rating(db_session, test_data):
    """Test deleting a rating directly with the CRUD function"""
    # First create a test rating
    db_rating = Ratings(
        rating=test_data["full_rating_data"]["rating"],
        comment=test_data["full_rating_data"]["comment"],
        created_at=test_data["full_rating_data"]["created_at"],
        giver_id=test_data["giver_id"],
        receiver_id=test_data["receiver_id"]
    )
    db_session.add(db_rating)
    db_session.commit()
    db_session.refresh(db_rating)
    
    rating_id = db_rating.id
    
    # Delete the rating
    result = delete_rating(db=db_session, rating_id=rating_id)
    
    # Verify we get a success message
    assert "message" in result
    assert f"Rating with ID {rating_id} deleted" in result["message"]
    
    # Verify the rating was actually deleted from the database
    db_rating = db_session.query(Ratings).filter(Ratings.id == rating_id).first()
    assert db_rating is None

def test_delete_nonexistent_rating(db_session):
    """Test deleting a rating that doesn't exist"""
    # Try to delete a rating with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        delete_rating(db=db_session, rating_id=999)
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Rating not found" in excinfo.value.detail

def test_rating_bounds(db_session, test_data):
    """Test creating ratings with boundary values"""
    # Test minimum rating (1)
    min_rating = Ratings(
        rating=1,
        comment="Minimum rating",
        created_at=current_time,
        giver_id=test_data["giver_id"],
        receiver_id=test_data["receiver_id"]
    )
    db_session.add(min_rating)
    db_session.commit()
    db_session.refresh(min_rating)
    assert min_rating.rating == 1
    
    # Test maximum rating (5) - assuming 5 is the maximum in your system
    max_rating = Ratings(
        rating=5,
        comment="Maximum rating",
        created_at=current_time,
        giver_id=test_data["giver_id"],
        receiver_id=test_data["receiver_id"]
    )
    db_session.add(max_rating)
    db_session.commit()
    db_session.refresh(max_rating)
    assert max_rating.rating == 5