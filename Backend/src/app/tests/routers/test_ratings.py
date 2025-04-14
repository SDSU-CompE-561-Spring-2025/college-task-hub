from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime

def test_create_rating(client: TestClient, db: Session):
    rating_data = {
        "rating": 5,
        "comment": "Great service!",
        "created_at": datetime.now().isoformat(),
        "giver_id": 1,
        "receiver_id": 2
    }
    response = client.post("/api/rating", json=rating_data)
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == rating_data["rating"]
    assert data["comment"] == rating_data["comment"]

def test_get_rating_by_id(client: TestClient, db: Session):
    # First create a rating
    rating_data = {
        "rating": 5,
        "comment": "Great service!",
        "created_at": datetime.now().isoformat(),
        "giver_id": 1,
        "receiver_id": 2
    }
    response = client.post("/api/rating", json=rating_data)
    rating_id = response.json()["id"]

    # Then get the rating by ID
    response = client.get(f"/api/rating/{rating_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == rating_data["rating"]
    assert data["comment"] == rating_data["comment"]

def test_update_rating(client: TestClient, db: Session):
    # First create a rating
    rating_data = {
        "rating": 5,
        "comment": "Great service!",
        "created_at": datetime.now().isoformat(),
        "giver_id": 1,
        "receiver_id": 2
    }
    response = client.post("/api/rating", json=rating_data)
    rating_id = response.json()["id"]

    # Then update the rating
    update_data = {
        "rating": 4,
        "comment": "Good service",
        "created_at": datetime.now().isoformat(),
        "giver_id": 1,
        "receiver_id": 2
    }
    response = client.put(f"/api/rating/{rating_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == update_data["rating"]
    assert data["comment"] == update_data["comment"]

def test_delete_rating(client: TestClient, db: Session):
    # First create a rating
    rating_data = {
        "rating": 5,
        "comment": "Great service!",
        "created_at": datetime.now().isoformat(),
        "giver_id": 1,
        "receiver_id": 2
    }
    response = client.post("/api/rating", json=rating_data)
    rating_id = response.json()["id"]

    # Then delete the rating
    response = client.delete(f"/api/rating/{rating_id}")
    assert response.status_code == 200
    assert response.json()["message"] == f"Rating with ID {rating_id} deleted"

    # Verify the rating is deleted
    response = client.get(f"/api/rating/{rating_id}")
    assert response.status_code == 404
