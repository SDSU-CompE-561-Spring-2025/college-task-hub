from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.core.auth import create_access_token
from app.schema.users import UsersCreate

def create_test_user_and_token(client: TestClient, db: Session):
    # Create test user
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
    
    # Get token
    response = client.post(
        "/api/user/token",
        data={"username": user_data["name"], "password": user_data["password"]}
    )
    token = response.json()["access_token"]
    return token

def test_create_location(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
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

def test_get_locations(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    client.post(
        "/api/location", 
        json=location_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    # Then get all locations
    response = client.get(
        "/api/location",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["street"] == location_data["street"]

def test_get_location_by_id(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
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

    # Then get the location by ID
    response = client.get(
        f"/api/location/{location_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["street"] == location_data["street"]
    assert data["city"] == location_data["city"]

def test_update_location(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
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

    # Then update the location
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

def test_delete_location(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
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

    # Then delete the location
    response = client.delete(
        f"/api/location/{location_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == f"Location with ID {location_id} deleted"

    # Verify the location is deleted
    response = client.get(
        f"/api/location/{location_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
