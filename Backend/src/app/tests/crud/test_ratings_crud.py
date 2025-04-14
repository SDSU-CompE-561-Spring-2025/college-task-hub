from sqlalchemy.orm import Session
from app.models.ratings import Ratings
from app.schema.ratings import RatingsCreate
from datetime import datetime

def test_create_rating(client, db: Session):
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

def test_get_rating(client, db: Session):
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

    # Then get it
    response = client.get(f"/api/rating/{rating_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == rating_data["rating"]

def test_update_rating(client, db: Session):
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

    # Then update it
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

def test_delete_rating(client, db: Session):
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

    # Then delete it
    response = client.delete(f"/api/rating/{rating_id}")
    assert response.status_code == 200
    assert response.json()["message"] == f"Rating with ID {rating_id} deleted"
