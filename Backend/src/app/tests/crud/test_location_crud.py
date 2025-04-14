from sqlalchemy.orm import Session
from app.models.locations import Locations
from app.schema.locations import LocationsCreate

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

def test_create_location(client, db: Session):
    token = get_auth_token(client)
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post(
        "/api/location", 
        json=location_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["street"] == location_data["street"]
    assert data["city"] == location_data["city"]

def test_get_location(client, db: Session):
    token = get_auth_token(client)
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post(
        "/api/location", 
        json=location_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    location_id = response.json()["id"]

    # Then get it
    response = client.get(
        f"/api/location/{location_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["street"] == location_data["street"]

def test_update_location(client, db: Session):
    token = get_auth_token(client)
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post(
        "/api/location", 
        json=location_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    location_id = response.json()["id"]

    # Then update it
    update_data = {
        "street": "456 New St",
        "city": "New City",
        "state": "NC",
        "zipcode": 54321
    }
    response = client.put(
        f"/api/location/{location_id}", 
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["street"] == update_data["street"]
    assert data["city"] == update_data["city"]

def test_delete_location(client, db: Session):
    token = get_auth_token(client)
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post(
        "/api/location", 
        json=location_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    location_id = response.json()["id"]

    # Then delete it
    response = client.delete(
        f"/api/location/{location_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == f"Location with ID {location_id} deleted"
