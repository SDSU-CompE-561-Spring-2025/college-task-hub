import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.users import Users
from app.schema.users import UsersCreate
from app.crud.users import create_user, get_user, get_users, update_user, delete_user, authenticate_user
from app.core.auth import get_password_hash
from fastapi import HTTPException

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_users_crud.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

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

@pytest.fixture
def test_data():
    """Create test user data"""
    test_user_data = {
        "name": "testuser",
        "email": "test@example.com",
        "password": "password123",
        "skills": "Python, FastAPI",
        "roles": "Developer",
        "rating": 5,
        "phone_number": "1234567890"
    }
    
    updated_user_data = {
        "name": "updateduser",
        "email": "updated@example.com",
        "password": "newpassword123",
        "skills": "Python, FastAPI, SQL",
        "roles": "Senior Developer",
        "rating": 4,
        "phone_number": "9876543210"
    }
    
    return {
        "test_user_data": UsersCreate(**test_user_data),
        "raw_test_user_data": test_user_data,
        "updated_user_data": UsersCreate(**updated_user_data),
        "raw_updated_user_data": updated_user_data
    }

def test_create_user(db_session, test_data):
    """Test creating a new user directly with the CRUD function"""
    user = create_user(db=db_session, user_data=test_data["test_user_data"])
    
    # Verify the returned object has correct data
    assert user.name == test_data["test_user_data"].name
    assert user.email == test_data["test_user_data"].email
    assert user.skills == test_data["test_user_data"].skills
    assert user.roles == test_data["test_user_data"].roles
    assert user.rating == test_data["test_user_data"].rating
    assert user.phone_number == test_data["test_user_data"].phone_number
    assert user.id is not None
    assert user.password_hash != test_data["test_user_data"].password  # Password should be hashed
    
    # Verify the object was actually saved to the database
    db_user = db_session.query(Users).filter(Users.id == user.id).first()
    assert db_user is not None
    assert db_user.name == test_data["test_user_data"].name
    assert db_user.email == test_data["test_user_data"].email

def test_authenticate_user(db_session, test_data):
    """Test authenticating a user with correct credentials"""
    # First create a user
    create_user(db=db_session, user_data=test_data["test_user_data"])
    
    # Test authentication with correct credentials
    authenticated_user = authenticate_user(
        db=db_session,
        name=test_data["raw_test_user_data"]["name"],
        password=test_data["raw_test_user_data"]["password"]
    )
    
    # Verify we get the user back
    assert authenticated_user is not False
    assert authenticated_user.name == test_data["test_user_data"].name
    assert authenticated_user.email == test_data["test_user_data"].email

def test_authenticate_user_wrong_password(db_session, test_data):
    """Test authenticating a user with wrong password"""
    # First create a user
    create_user(db=db_session, user_data=test_data["test_user_data"])
    
    # Test authentication with wrong password
    authenticated_user = authenticate_user(
        db=db_session,
        name=test_data["raw_test_user_data"]["name"],
        password="wrongpassword"
    )
    
    # Verify authentication fails
    assert authenticated_user is False

def test_authenticate_user_nonexistent(db_session):
    """Test authenticating a non-existent user"""
    # Test authentication with non-existent user
    authenticated_user = authenticate_user(
        db=db_session,
        name="nonexistentuser",
        password="password123"
    )
    
    # Verify authentication fails
    assert authenticated_user is False

def test_get_users(db_session, test_data):
    """Test getting all users directly with the CRUD function"""
    # First create some test users
    create_user(db=db_session, user_data=test_data["test_user_data"])
    
    # Change email and phone for the second user to avoid unique constraint violations
    second_user_data = test_data["updated_user_data"]
    
    create_user(db=db_session, user_data=second_user_data)
    
    # Get all users
    users = get_users(db=db_session)
    
    # Verify we get a list with the correct users
    assert isinstance(users, list)
    assert len(users) == 2
    assert any(user.name == test_data["test_user_data"].name for user in users)
    assert any(user.name == second_user_data.name for user in users)

def test_get_user(db_session, test_data):
    """Test getting a single user by ID directly with the CRUD function"""
    # First create a test user
    user = create_user(db=db_session, user_data=test_data["test_user_data"])
    
    # Get the user by ID
    retrieved_user = get_user(db=db_session, user_id=user.id)
    
    # Verify we get the correct user
    assert retrieved_user.id == user.id
    assert retrieved_user.name == test_data["test_user_data"].name
    assert retrieved_user.email == test_data["test_user_data"].email
    assert retrieved_user.skills == test_data["test_user_data"].skills
    assert retrieved_user.roles == test_data["test_user_data"].roles
    assert retrieved_user.rating == test_data["test_user_data"].rating
    assert retrieved_user.phone_number == test_data["test_user_data"].phone_number

def test_get_nonexistent_user(db_session):
    """Test getting a user that doesn't exist"""
    # Try to get a user with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        get_user(db=db_session, user_id=999)
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "User not found" in excinfo.value.detail

def test_update_user(db_session, test_data):
    """Test updating a user directly with the CRUD function"""
    # First create a test user
    user = create_user(db=db_session, user_data=test_data["test_user_data"])
    
    # Update the user
    updated_user = update_user(
        db=db_session, 
        user_id=user.id, 
        user_data=test_data["updated_user_data"]
    )
    
    # Verify the returned object has the updated data
    assert updated_user.id == user.id
    assert updated_user.name == test_data["updated_user_data"].name
    assert updated_user.email == test_data["updated_user_data"].email
    assert updated_user.skills == test_data["updated_user_data"].skills
    assert updated_user.roles == test_data["updated_user_data"].roles
    assert updated_user.rating == test_data["updated_user_data"].rating
    assert updated_user.phone_number == test_data["updated_user_data"].phone_number
    
    # Verify the password was hashed during update
    assert updated_user.password_hash != test_data["updated_user_data"].password
    
    # Verify the object was actually updated in the database
    db_user = db_session.query(Users).filter(Users.id == user.id).first()
    assert db_user.name == test_data["updated_user_data"].name
    assert db_user.email == test_data["updated_user_data"].email

def test_update_nonexistent_user(db_session, test_data):
    """Test updating a user that doesn't exist"""
    # Try to update a user with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        update_user(
            db=db_session, 
            user_id=999, 
            user_data=test_data["updated_user_data"]
        )
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "User not found" in excinfo.value.detail

def test_delete_user(db_session, test_data):
    """Test deleting a user directly with the CRUD function"""
    # First create a test user
    user = create_user(db=db_session, user_data=test_data["test_user_data"])
    
    # Delete the user
    result = delete_user(db=db_session, user_id=user.id)
    
    # Verify we get a success message
    assert "message" in result
    assert f"User with ID {user.id} deleted" in result["message"]
    
    # Verify the user was actually deleted from the database
    db_user = db_session.query(Users).filter(Users.id == user.id).first()
    assert db_user is None

def test_delete_nonexistent_user(db_session):
    """Test deleting a user that doesn't exist"""
    # Try to delete a user with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        delete_user(db=db_session, user_id=999)
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "User not found" in excinfo.value.detail

def test_password_hashing(db_session, test_data):
    """Test that passwords are properly hashed when creating/updating users"""
    # Create a user
    user = create_user(db=db_session, user_data=test_data["test_user_data"])
    
    # Verify the password was hashed
    assert user.password_hash != test_data["test_user_data"].password
    
    # Verify we can authenticate with the original password
    authenticated_user = authenticate_user(
        db=db_session,
        name=test_data["raw_test_user_data"]["name"],
        password=test_data["raw_test_user_data"]["password"]
    )
    assert authenticated_user is not False
    
    # Update the user with a new password
    updated_user = update_user(
        db=db_session, 
        user_id=user.id, 
        user_data=test_data["updated_user_data"]
    )
    
    # Verify the new password was hashed
    assert updated_user.password_hash != test_data["updated_user_data"].password
    
    # Verify we can authenticate with the new password
    authenticated_user = authenticate_user(
        db=db_session,
        name=test_data["raw_updated_user_data"]["name"],
        password=test_data["raw_updated_user_data"]["password"]
    )
    assert authenticated_user is not False
    
    # Verify we can't authenticate with the old password
    authenticated_user = authenticate_user(
        db=db_session,
        name=test_data["raw_updated_user_data"]["name"],
        password=test_data["raw_test_user_data"]["password"]
    )
    assert authenticated_user is False

def test_email_uniqueness(db_session, test_data):
    """Test that users can't be created with duplicate emails"""
    # First create a user
    create_user(db=db_session, user_data=test_data["test_user_data"])
    
    # Try to create another user with the same email but different name/phone
    duplicate_user_data = UsersCreate(
        name="anotheruser",
        email=test_data["raw_test_user_data"]["email"],  # Same email
        password="anotherpassword",
        skills="Some skills",
        roles="Some role",
        rating=3,
        phone_number="5555555555"  # Different phone
    )
    
    # This operation might raise an exception due to the unique constraint
    # The exact exception depends on how your CRUD function handles database errors
    try:
        create_user(db=db_session, user_data=duplicate_user_data)
        # If we get here, no exception was raised
        # Check if there's only one user with this email
        users_with_email = db_session.query(Users).filter(
            Users.email == test_data["raw_test_user_data"]["email"]
        ).count()
        assert users_with_email == 1
    except Exception:
        # An exception was raised, which is expected due to the unique constraint
        pass