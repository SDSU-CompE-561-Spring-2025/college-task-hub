from sqlalchemy.orm import Session
from app.models.users import Users
from app.schema.users import UsersCreate

def test_create_user(client, db: Session):
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",  # Must be at least 8 characters
        "skills": "Python, FastAPI",  # String instead of list
        "roles": "student",  # String instead of list
        "rating": 4,  # Integer instead of float
        "phone_number": "1234567890"
    }
    response = client.post("/api/user", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]
    assert "password" not in data  # Password should not be returned

def test_get_user(client, db: Session):
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

    # Then get it
    response = client.get(f"/api/user/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]

def test_update_user(client, db: Session):
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

    # Then update it
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
    assert data["rating"] == update_data["rating"]

def test_delete_user(client, db: Session):
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

    # Then delete it
    response = client.delete(f"/api/user/{user_id}")
    assert response.status_code == 200
    assert response.json()["message"] == f"User with ID {user_id} deleted"
