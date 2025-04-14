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

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after test
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    # Override the dependency
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

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

def get_auth_token(client):
    """Helper function to get auth token"""
    # First create a user if not exists
    client.post("/api/user", json=test_user)
    
    # Then get token
    response = client.post(
        "/api/user/token",
        data={"username": test_user["name"], "password": test_user["password"]}
    )
    return response.json()["access_token"]

def test_create_user(client, db):
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

def test_user_login(client, db):
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

def test_failed_login(client, db):
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

def test_get_users(client, db):
    """Test getting all users"""
    token = get_auth_token(client)
    
    # Then get all users
    response = client.get(
        "/api/user",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["name"] == test_user["name"]
    assert data[0]["email"] == test_user["email"]

def test_update_user(client, db):
    """Test updating a user"""
    token = get_auth_token(client)
    
    # Get the user ID
    response = client.get(
        "/api/user",
        headers={"Authorization": f"Bearer {token}"}
    )
    user_id = response.json()[0]["id"]
    
    # Then update the user
    update_response = client.put(
        f"/api/user/{user_id}",
        json=updated_user,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["id"] == user_id
    assert data["name"] == updated_user["name"]
    assert data["email"] == updated_user["email"]
    assert data["skills"] == updated_user["skills"]
    assert data["roles"] == updated_user["roles"]
    assert data["rating"] == updated_user["rating"]
    assert data["phone_number"] == updated_user["phone_number"]

def test_delete_user(client, db):
    """Test deleting a user"""
    # Create first test user to delete
    user_data1 = {
        "name": "testuser1",
        "email": "test1@example.com",
        "password": "password123",
        "skills": "Python, FastAPI",
        "roles": "Developer",
        "rating": 5,
        "phone_number": "1234567890"
    }
    client.post("/api/user", json=user_data1)
    
    # Get token for first user
    response = client.post(
        "/api/user/token",
        data={"username": user_data1["name"], "password": user_data1["password"]}
    )
    token1 = response.json()["access_token"]
    
    # Get the user ID
    response = client.get(
        "/api/user",
        headers={"Authorization": f"Bearer {token1}"}
    )
    user_id = response.json()[0]["id"]
    
    # Create second test user for verification with different phone number
    user_data2 = {
        "name": "testuser2",
        "email": "test2@example.com",
        "password": "password123",
        "skills": "Python, FastAPI",
        "roles": "Developer",
        "rating": 5,
        "phone_number": "0987654321"
    }
    client.post("/api/user", json=user_data2)
    
    # Get token for second user
    response = client.post(
        "/api/user/token",
        data={"username": user_data2["name"], "password": user_data2["password"]}
    )
    token2 = response.json()["access_token"]
    
    # Then delete the first user
    delete_response = client.delete(
        f"/api/user/{user_id}",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == f"User with ID {user_id} deleted"
    
    # Try to get the deleted user using the second user's token
    get_response = client.get(
        f"/api/user/{user_id}",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert get_response.status_code == 404

def test_update_nonexistent_user(client, db):
    """Test updating a user that doesn't exist"""
    token = get_auth_token(client)
    
    response = client.put(
        "/api/user/999",
        json=updated_user,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"

def test_delete_nonexistent_user(client, db):
    """Test deleting a user that doesn't exist"""
    token = get_auth_token(client)
    
    response = client.delete(
        "/api/user/999",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"

def test_create_user_missing_fields(client, db):
    """Test creating a user with missing required fields"""
    incomplete_user = {
        "name": "incomplete",
        "email": "incomplete@example.com"
        # Missing password, phone_number, etc.
    }
    response = client.post("/api/user", json=incomplete_user)
    assert response.status_code == 422  # Unprocessable Entity

def test_create_user_invalid_email(client, db):
    """Test creating a user with an invalid email"""
    invalid_user = test_user.copy()
    invalid_user["email"] = "not-an-email"
    response = client.post("/api/user", json=invalid_user)
    assert response.status_code == 422  # Unprocessable Entity

def test_create_user_password_too_short(client, db):
    """Test creating a user with a password that's too short"""
    invalid_user = test_user.copy()
    invalid_user["password"] = "short"
    response = client.post("/api/user", json=invalid_user)
    assert response.status_code == 422  # Unprocessable Entity