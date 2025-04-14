from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

def test_create_location(client: TestClient, db: Session):
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post("/api/location", json=location_data)
    assert response.status_code == 200
    data = response.json()
    assert data["street"] == location_data["street"]
    assert data["city"] == location_data["city"]

def test_get_locations(client: TestClient, db: Session):
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    client.post("/api/location", json=location_data)

    # Then get all locations
    response = client.get("/api/location")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["street"] == location_data["street"]

def test_get_location_by_id(client: TestClient, db: Session):
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post("/api/location", json=location_data)
    location_id = response.json()["id"]

    # Then get the location by ID
    response = client.get(f"/api/location/{location_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["street"] == location_data["street"]
    assert data["city"] == location_data["city"]

def test_update_location(client: TestClient, db: Session):
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post("/api/location", json=location_data)
    location_id = response.json()["id"]

    # Then update the location
    update_data = {
        "street": "456 New St",
        "city": "New City",
        "state": "NC",
        "zipcode": 54321
    }
    response = client.put(f"/api/location/{location_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["street"] == update_data["street"]
    assert data["city"] == update_data["city"]

def test_delete_location(client: TestClient, db: Session):
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post("/api/location", json=location_data)
    location_id = response.json()["id"]

    # Then delete the location
    response = client.delete(f"/api/location/{location_id}")
    assert response.status_code == 200
    assert response.json()["message"] == f"Location with ID {location_id} deleted"

    # Verify the location is deleted
    response = client.get(f"/api/location/{location_id}")
    assert response.status_code == 404
