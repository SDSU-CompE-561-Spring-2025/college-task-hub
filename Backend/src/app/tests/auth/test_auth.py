import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base
from app.dependencies import get_db
from app.models.users import Users
from app.schema.users import UsersCreate
from fastapi.security import OAuth2PasswordRequestForm

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_users.db"
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
test_user = {
    "name": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "skills": "Python, FastAPI",
    "roles": "Developer",
    "rating": 5,
    "phone_number": "1234567890"
}

updated_user = {
    "name": "updateduser",
    "email": "updated@example.com",
    "password": "newpassword123",
    "skills": "Python, FastAPI, SQL",
    "roles": "Senior Developer",
    "rating": 4,
    "phone_number": "9876543210"
}

login_data = {
    "username": "testuser",
    "password": "password123"
}

@pytest.fixture
def test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

def test_create_user(test_db):
    """Test creating a new user"""
    response = client.post("/api/user", json=test_user)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == test_user["name"]
    assert data["email"] == test_user["email"]
    assert data["skills"] == test_user["skills"]
    assert data["roles"] == test_user["roles"]
    assert data["rating"] == test_user["rating"]
    assert data["phone_number"] == test_user["phone_number"]
    assert "id" in data
    assert "password" not in data  # Ensure password is not returned in response

def test_user_login(test_db):
    """Test user login and token generation"""
    # First create a user
    client.post("/api/user", json=test_user)
    
    # Then try to login
    response = client.post(
        "/api/user/token",
        data={"username": test_user["name"], "password": test_user["password"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_failed_login(test_db):
    """Test login with incorrect credentials"""
    # First create a user
    client.post("/api/user", json=test_user)
    
    # Then try to login with wrong password
    response = client.post(
        "/api/user/token",
        data={"username": test_user["name"], "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "detail" in response.json()

def test_get_users(test_db):
    """Test getting all users"""
    # First create a user
    client.post("/api/user", json=test_user)
    
    # Then get all users
    response = client.get("/api/user")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["name"] == test_user["name"]
    assert data[0]["email"] == test_user["email"]

def test_update_user(test_db):
    """Test updating a user"""
    # First create a user
    create_response = client.post("/api/user", json=test_user)
    user_id = create_response.json()["id"]
    
    # Then update the user
    update_response = client.put(f"/api/user/{user_id}", json=updated_user)
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["id"] == user_id
    assert data["name"] == updated_user["name"]
    assert data["email"] == updated_user["email"]
    assert data["skills"] == updated_user["skills"]
    assert data["roles"] == updated_user["roles"]
    assert data["rating"] == updated_user["rating"]
    assert data["phone_number"] == updated_user["phone_number"]

def test_delete_user(test_db):
    """Test deleting a user"""
    # First create a user
    create_response = client.post("/api/user", json=test_user)
    user_id = create_response.json()["id"]
    
    # Then delete the user
    delete_response = client.delete(f"/api/user/{user_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == f"User with ID {user_id} deleted"
    
    # Verify deletion by trying to get all users (should be empty list)
    get_response = client.get("/api/user")
    assert len(get_response.json()) == 0

def test_update_nonexistent_user(test_db):
    """Test updating a user that doesn't exist"""
    response = client.put("/api/user/999", json=updated_user)
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"

def test_delete_nonexistent_user(test_db):
    """Test deleting a user that doesn't exist"""
    response = client.delete("/api/user/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"

def test_create_user_missing_fields():
    """Test creating a user with missing required fields"""
    incomplete_user = {
        "name": "incomplete",
        "email": "incomplete@example.com"
        # Missing password, phone_number, etc.
    }
    response = client.post("/api/user", json=incomplete_user)
    assert response.status_code == 422  # Unprocessable Entity

def test_create_user_invalid_email():
    """Test creating a user with an invalid email"""
    invalid_user = test_user.copy()
    invalid_user["email"] = "not-an-email"
    response = client.post("/api/user", json=invalid_user)
    assert response.status_code == 422  # Unprocessable Entity

def test_create_user_password_too_short():
    """Test creating a user with a password that's too short"""
    invalid_user = test_user.copy()
    invalid_user["password"] = "short"
    response = client.post("/api/user", json=invalid_user)
    assert response.status_code == 422  # Unprocessable Entity