from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.auth import create_access_token
from app.schema.users import UsersCreate

def create_test_user_and_token(client: TestClient, db: Session):
    # Create test user
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
    
    # Get token
    response = client.post(
        "/api/user/token",
        data={"username": user_data["name"], "password": user_data["password"]}
    )
    token = response.json()["access_token"]
    return token, user_data

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
        "username": user_data["name"],
        "password": user_data["password"]
    }
    response = client.post("/api/user/token", data=form_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_get_users(client: TestClient, db: Session):
    token, user_data = create_test_user_and_token(client, db)

    # Then get all users
    response = client.get(
        "/api/user",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == user_data["name"]

def test_get_user_by_id(client: TestClient, db: Session):
    token, user_data = create_test_user_and_token(client, db)

    # Get user ID
    response = client.get(
        "/api/user",
        headers={"Authorization": f"Bearer {token}"}
    )
    user_id = response.json()[0]["id"]

    # Then get the user by ID
    response = client.get(
        f"/api/user/{user_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]

def test_update_user(client: TestClient, db: Session):
    token, user_data = create_test_user_and_token(client, db)

    # Get user ID
    response = client.get(
        "/api/user",
        headers={"Authorization": f"Bearer {token}"}
    )
    user_id = response.json()[0]["id"]

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
    response = client.put(
        f"/api/user/{user_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["email"] == update_data["email"]

def test_delete_user(client: TestClient, db: Session):
    # Create first test user to delete
    user_data1 = {
        "name": "Test User 1",
        "email": "test1@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
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
        "name": "Test User 2",
        "email": "test2@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
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
    response = client.delete(
        f"/api/user/{user_id}",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == f"User with ID {user_id} deleted"
    
    # Verify the user is deleted using the second user's token
    response = client.get(
        f"/api/user/{user_id}",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 404
