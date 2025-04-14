from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.auth import create_access_token
from app.schema.users import UsersCreate

def test_create_user(client: TestClient, db: Session):
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "1234567890"
    }
    response = client.post("/api/user", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]
    assert "password" not in data

def test_login_for_access_token(client: TestClient, db: Session):
    # First create a user
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "1234567890"
    }
    client.post("/api/user", json=user_data)

    # Then try to login
    form_data = {
        "username": "Test User",
        "password": "testpassword123"
    }
    response = client.post("/api/user/token", data=form_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_get_users(client: TestClient, db: Session):
    # First create a user
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "1234567890"
    }
    client.post("/api/user", json=user_data)

    # Then get all users
    response = client.get("/api/user")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == user_data["name"]

def test_get_user_by_id(client: TestClient, db: Session):
    # First create a user
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "1234567890"
    }
    response = client.post("/api/user", json=user_data)
    user_id = response.json()["id"]

    # Then get the user by ID
    response = client.get(f"/api/user/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]

def test_update_user(client: TestClient, db: Session):
    # First create a user
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "1234567890"
    }
    response = client.post("/api/user", json=user_data)
    user_id = response.json()["id"]

    # Then update the user
    update_data = {
        "name": "Updated User",
        "email": "updated@example.com",
        "password": "newpassword123",
        "skills": "Python, FastAPI, SQL",
        "roles": "student, tutor",
        "rating": 5,
        "phone_number": "0987654321"
    }
    response = client.put(f"/api/user/{user_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["email"] == update_data["email"]

def test_delete_user(client: TestClient, db: Session):
    # First create a user
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "1234567890"
    }
    response = client.post("/api/user", json=user_data)
    user_id = response.json()["id"]

    # Then delete the user
    response = client.delete(f"/api/user/{user_id}")
    assert response.status_code == 200
    assert response.json()["message"] == f"User with ID {user_id} deleted"

    # Verify the user is deleted
    response = client.get(f"/api/user/{user_id}")
    assert response.status_code == 404
