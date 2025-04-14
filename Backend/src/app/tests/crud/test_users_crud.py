from sqlalchemy.orm import Session
from app.models.users import Users
from app.schema.users import UsersCreate

def get_auth_token(client, email_suffix=""):
    """Helper function to get auth token"""
    # First create a user if not exists
    user_data = {
        "name": f"testuser{email_suffix}",
        "email": f"test{email_suffix}@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": f"123456789{email_suffix}"
    }
    client.post("/api/user", json=user_data)
    
    # Then get token
    response = client.post(
        "/api/user/token",
        data={"username": user_data["name"], "password": user_data["password"]}
    )
    return response.json()["access_token"]

def test_create_user(client, db: Session):
    token = get_auth_token(client, "1")
    user_data = {
        "name": "Test User 2",
        "email": "test2@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "0987654321"
    }
    response = client.post(
        "/api/user", 
        json=user_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]
    assert "password" not in data

def test_get_user(client, db: Session):
    token = get_auth_token(client, "3")
    # First create a user
    user_data = {
        "name": "Test User 4",
        "email": "test4@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "0987654322"
    }
    response = client.post(
        "/api/user", 
        json=user_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    user_id = response.json()["id"]

    # Then get it
    response = client.get(
        f"/api/user/{user_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]

def test_update_user(client, db: Session):
    token = get_auth_token(client, "5")
    # First create a user
    user_data = {
        "name": "Test User 6",
        "email": "test6@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "0987654323"
    }
    response = client.post(
        "/api/user", 
        json=user_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    user_id = response.json()["id"]

    # Then update it
    update_data = {
        "name": "Updated User",
        "email": "updated7@example.com",
        "password": "newpassword123",
        "skills": "Python, FastAPI, SQL",
        "roles": "student, tutor",
        "rating": 5,
        "phone_number": "0987654324"
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
    assert data["rating"] == update_data["rating"]

def test_delete_user(client, db: Session):
    token = get_auth_token(client, "8")
    # First create a user
    user_data = {
        "name": "Test User 9",
        "email": "test9@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "0987654325"
    }
    response = client.post(
        "/api/user", 
        json=user_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    user_id = response.json()["id"]

    # Then delete it
    response = client.delete(
        f"/api/user/{user_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == f"User with ID {user_id} deleted"
