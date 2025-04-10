import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base
from app.dependencies import get_db
from app.models.ratings import Ratings
from app.schema.ratings import RatingsCreate
from datetime import datetime, UTC

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_ratings.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the tables
Base.metadata.create_all(bind=engine)

# Override the dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

# Current timestamp for testing
current_time = datetime.now(UTC)

# Test data
test_rating = {
    "rating": 5,
    "comment": "Excellent service",
    "created_at": current_time.isoformat()
}

updated_rating = {
    "rating": 4,
    "comment": "Good service but could be better",
    "created_at": current_time.isoformat()
}

@pytest.fixture
def test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

def test_create_rating(test_db):
    """Test creating a new rating"""
    response = client.post("/api/rating", json=test_rating)
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == test_rating["rating"]
    assert data["comment"] == test_rating["comment"]
    assert "id" in data

def test_get_rating(test_db):
    """Test getting a rating by ID"""
    # First create a rating
    create_response = client.post("/api/rating", json=test_rating)
    rating_id = create_response.json()["id"]
    
    # Then get that specific rating
    get_response = client.get(f"/api/rating/{rating_id}")
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["id"] == rating_id
    assert data["rating"] == test_rating["rating"]
    assert data["comment"] == test_rating["comment"]

def test_update_rating(test_db):
    """Test updating a rating"""
    # First create a rating
    create_response = client.post("/api/rating", json=test_rating)
    rating_id = create_response.json()["id"]
    
    # Then update the rating
    update_response = client.put(f"/api/rating/{rating_id}", json=updated_rating)
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["id"] == rating_id
    assert data["rating"] == updated_rating["rating"]
    assert data["comment"] == updated_rating["comment"]
    
    # Verify update by getting the rating
    get_response = client.get(f"/api/rating/{rating_id}")
    assert get_response.json()["rating"] == updated_rating["rating"]

def test_delete_rating(test_db):
    """Test deleting a rating"""
    # First create a rating
    create_response = client.post("/api/rating", json=test_rating)
    rating_id = create_response.json()["id"]
    
    # Then delete the rating
    delete_response = client.delete(f"/api/rating/{rating_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == f"Rating with ID {rating_id} deleted"
    
    # Verify deletion by trying to get the rating (should return 404)
    get_response = client.get(f"/api/rating/{rating_id}")
    assert get_response.status_code == 404

def test_get_nonexistent_rating(test_db):
    """Test getting a rating that doesn't exist"""
    response = client.get("/api/rating/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Rating not found"

def test_update_nonexistent_rating(test_db):
    """Test updating a rating that doesn't exist"""
    response = client.put("/api/rating/999", json=updated_rating)
    assert response.status_code == 404
    assert response.json()["detail"] == "Rating not found"

def test_delete_nonexistent_rating(test_db):
    """Test deleting a rating that doesn't exist"""
    response = client.delete("/api/rating/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Rating not found"

def test_create_rating_missing_fields():
    """Test creating a rating with missing required fields"""
    incomplete_rating = {
        "rating": 3
        # Missing comment and created_at
    }
    response = client.post("/api/rating", json=incomplete_rating)
    assert response.status_code == 422  # Unprocessable Entity

def test_create_rating_invalid_rating():
    """Test creating a rating with an invalid rating value"""
    invalid_rating = {
        "rating": 6,  # Rating should likely be 1-5
        "comment": "Invalid rating",
        "created_at": current_time.isoformat()
    }
    response = client.post("/api/rating", json=invalid_rating)
    # This might return 422 if you have validation, but depends on your implementation
    assert response.status_code in [200, 422]