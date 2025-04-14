from sqlalchemy.orm import Session
from app.models.ratings import Ratings
from app.schema.ratings import RatingsCreate
from datetime import datetime

def get_auth_token(client):
    """Helper function to get auth token"""
    # First create a user if not exists
    user_data = {
        "name": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
        "skills": "Python, FastAPI",
        "roles": "student",
        "rating": 4,
        "phone_number": "1234567890"
    }
    client.post("/api/user", json=user_data)
    
    # Then get token
    response = client.post(
        "/api/user/token",
        data={"username": user_data["name"], "password": user_data["password"]}
    )
    return response.json()["access_token"]

def test_create_rating(client, db: Session):
    token = get_auth_token(client)
    rating_data = {
        "rating": 5,
        "comment": "Great service!",
        "created_at": datetime.now().isoformat(),
        "giver_id": 1,
        "receiver_id": 2
    }
    response = client.post(
        "/api/rating", 
        json=rating_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == rating_data["rating"]
    assert data["comment"] == rating_data["comment"]

def test_get_rating(client, db: Session):
    token = get_auth_token(client)
    # First create a rating
    rating_data = {
        "rating": 5,
        "comment": "Great service!",
        "created_at": datetime.now().isoformat(),
        "giver_id": 1,
        "receiver_id": 2
    }
    response = client.post(
        "/api/rating", 
        json=rating_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    rating_id = response.json()["id"]

    # Then get it
    response = client.get(
        f"/api/rating/{rating_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == rating_data["rating"]

def test_update_rating(client, db: Session):
    token = get_auth_token(client)
    # First create a rating
    rating_data = {
        "rating": 5,
        "comment": "Great service!",
        "created_at": datetime.now().isoformat(),
        "giver_id": 1,
        "receiver_id": 2
    }
    response = client.post(
        "/api/rating", 
        json=rating_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    rating_id = response.json()["id"]

    # Then update it
    update_data = {
        "rating": 4,
        "comment": "Good service",
        "created_at": datetime.now().isoformat(),
        "giver_id": 1,
        "receiver_id": 2
    }
    response = client.put(
        f"/api/rating/{rating_id}", 
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == update_data["rating"]
    assert data["comment"] == update_data["comment"]

def test_delete_rating(client, db: Session):
    token = get_auth_token(client)
    # First create a rating
    rating_data = {
        "rating": 5,
        "comment": "Great service!",
        "created_at": datetime.now().isoformat(),
        "giver_id": 1,
        "receiver_id": 2
    }
    response = client.post(
        "/api/rating", 
        json=rating_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    rating_id = response.json()["id"]

    # Then delete it
    response = client.delete(
        f"/api/rating/{rating_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == f"Rating with ID {rating_id} deleted"
