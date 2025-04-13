import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base
from app.dependencies import get_db
from app.models.locations import Locations
from app.schema.locations import LocationsCreate

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
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

# Test data
test_location = {
    "street": "123 Test Street",
    "city": "Test City",
    "state": "TS",
    "zipcode": 12345
}

updated_location = {
    "street": "456 Updated Street",
    "city": "Updated City",
    "state": "US",
    "zipcode": 54321
}

@pytest.fixture
def test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

def test_create_location(test_db):
    """Test creating a new location"""
    response = client.post("/api/location", json=test_location)
    assert response.status_code == 200
    data = response.json()
    assert data["street"] == test_location["street"]
    assert data["city"] == test_location["city"]
    assert data["state"] == test_location["state"]
    assert data["zipcode"] == test_location["zipcode"]
    assert "id" in data

def test_get_locations(test_db):
    """Test getting all locations"""
    # First create a location
    client.post("/api/location", json=test_location)
    
    # Then get all locations
    response = client.get("/api/location")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["street"] == test_location["street"]

def test_update_location(test_db):
    """Test updating a location"""
    # First create a location
    create_response = client.post("/api/location", json=test_location)
    location_id = create_response.json()["id"]
    
    # Then update the location
    update_response = client.put(f"/api/location/{location_id}", json=updated_location)
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["id"] == location_id
    assert data["street"] == updated_location["street"]
    assert data["city"] == updated_location["city"]
    assert data["state"] == updated_location["state"]
    assert data["zipcode"] == updated_location["zipcode"]

def test_delete_location(test_db):
    """Test deleting a location"""
    # First create a location
    create_response = client.post("/api/location", json=test_location)
    location_id = create_response.json()["id"]
    
    # Then delete the location
    delete_response = client.delete(f"/api/location/{location_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == f"Location with ID {location_id} deleted"
    
    # Verify location is deleted by trying to get it
    get_response = client.get(f"/api/location/{location_id}")
    assert get_response.status_code == 404

def test_get_nonexistent_location(test_db):
    """Test getting a location that doesn't exist"""
    response = client.get("/api/location/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Location not found"

def test_update_nonexistent_location(test_db):
    """Test updating a location that doesn't exist"""
    response = client.put("/api/location/999", json=updated_location)
    assert response.status_code == 404
    assert response.json()["detail"] == "Location not found"

def test_delete_nonexistent_location(test_db):
    """Test deleting a location that doesn't exist"""
    response = client.delete("/api/location/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Location not found"

def test_create_location_missing_fields():
    """Test creating a location with missing required fields"""
    incomplete_location = {
        "street": "Incomplete Street"
        # Missing city, state, zipcode
    }
    response = client.post("/api/location", json=incomplete_location)
    assert response.status_code == 422  # Unprocessable Entity