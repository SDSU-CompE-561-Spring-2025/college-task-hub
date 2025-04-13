import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.locations import Locations
from app.schema.locations import LocationsCreate
from app.crud.locations import create_location, get_location, get_locations, update_location, delete_location
from fastapi import HTTPException

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_locations_crud.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Test data
test_location_data = LocationsCreate(
    street="123 Test Street",
    city="Test City",
    state="TS",
    zipcode=12345
)

updated_location_data = LocationsCreate(
    street="456 Updated Street",
    city="Updated City",
    state="US",
    zipcode=54321
)

@pytest.fixture
def db_session():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
    
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

def test_create_location(db_session):
    """Test creating a new location directly with the CRUD function"""
    location = create_location(db=db_session, location=test_location_data)
    
    # Verify the returned object has correct data
    assert location.street == test_location_data.street
    assert location.city == test_location_data.city
    assert location.state == test_location_data.state
    assert location.zipcode == test_location_data.zipcode
    assert location.id is not None
    
    # Verify the object was actually saved to the database
    db_location = db_session.query(Locations).filter(Locations.id == location.id).first()
    assert db_location is not None
    assert db_location.street == test_location_data.street

def test_get_locations(db_session):
    """Test getting all locations directly with the CRUD function"""
    # First create some test locations
    create_location(db=db_session, location=test_location_data)
    create_location(db=db_session, location=updated_location_data)
    
    # Get all locations
    locations = get_locations(db=db_session)
    
    # Verify we get a list with the correct locations
    assert isinstance(locations, list)
    assert len(locations) == 2
    assert any(loc.street == test_location_data.street for loc in locations)
    assert any(loc.street == updated_location_data.street for loc in locations)

def test_get_location(db_session):
    """Test getting a single location by ID directly with the CRUD function"""
    # First create a test location
    location = create_location(db=db_session, location=test_location_data)
    
    # Get the location by ID
    retrieved_location = get_location(db=db_session, location_id=location.id)
    
    # Verify we get the correct location
    assert retrieved_location.id == location.id
    assert retrieved_location.street == test_location_data.street
    assert retrieved_location.city == test_location_data.city
    assert retrieved_location.state == test_location_data.state
    assert retrieved_location.zipcode == test_location_data.zipcode

def test_get_nonexistent_location(db_session):
    """Test getting a location that doesn't exist"""
    # Try to get a location with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        get_location(db=db_session, location_id=999)
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Location not found" in excinfo.value.detail

def test_update_location(db_session):
    """Test updating a location directly with the CRUD function"""
    # First create a test location
    location = create_location(db=db_session, location=test_location_data)
    
    # Update the location
    updated_location = update_location(
        db=db_session, 
        location_id=location.id, 
        location_data=updated_location_data
    )
    
    # Verify the returned object has the updated data
    assert updated_location.id == location.id
    assert updated_location.street == updated_location_data.street
    assert updated_location.city == updated_location_data.city
    assert updated_location.state == updated_location_data.state
    assert updated_location.zipcode == updated_location_data.zipcode
    
    # Verify the object was actually updated in the database
    db_location = db_session.query(Locations).filter(Locations.id == location.id).first()
    assert db_location.street == updated_location_data.street

def test_update_nonexistent_location(db_session):
    """Test updating a location that doesn't exist"""
    # Try to update a location with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        update_location(
            db=db_session, 
            location_id=999, 
            location_data=updated_location_data
        )
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Location not found" in excinfo.value.detail

def test_delete_location(db_session):
    """Test deleting a location directly with the CRUD function"""
    # First create a test location
    location = create_location(db=db_session, location=test_location_data)
    
    # Delete the location
    result = delete_location(db=db_session, location_id=location.id)
    
    # Verify we get a success message
    assert "message" in result
    assert f"Location with ID {location.id} deleted" in result["message"]
    
    # Verify the location was actually deleted from the database
    db_location = db_session.query(Locations).filter(Locations.id == location.id).first()
    assert db_location is None

def test_delete_nonexistent_location(db_session):
    """Test deleting a location that doesn't exist"""
    # Try to delete a location with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        delete_location(db=db_session, location_id=999)
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Location not found" in excinfo.value.detail

def test_create_and_get_location_with_special_characters(db_session):
    """Test creating and getting a location with special characters"""
    # Create a location with special characters
    special_location_data = LocationsCreate(
        street="123 Test Street #&*",
        city="Test/City",
        state="T-S",
        zipcode=12345
    )
    
    location = create_location(db=db_session, location=special_location_data)
    
    # Get the location by ID
    retrieved_location = get_location(db=db_session, location_id=location.id)
    
    # Verify the special characters are preserved
    assert retrieved_location.street == special_location_data.street
    assert retrieved_location.city == special_location_data.city
    assert retrieved_location.state == special_location_data.state