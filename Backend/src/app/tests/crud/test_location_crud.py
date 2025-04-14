from sqlalchemy.orm import Session
from app.models.locations import Locations
from app.schema.locations import LocationsCreate

def test_create_location(client, db: Session):
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

def test_get_location(client, db: Session):
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post("/api/location", json=location_data)
    location_id = response.json()["id"]

    # Then get it
    response = client.get(f"/api/location/{location_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["street"] == location_data["street"]

def test_update_location(client, db: Session):
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post("/api/location", json=location_data)
    location_id = response.json()["id"]

    # Then update it
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

def test_delete_location(client, db: Session):
    # First create a location
    location_data = {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zipcode": 12345
    }
    response = client.post("/api/location", json=location_data)
    location_id = response.json()["id"]

    # Then delete it
    response = client.delete(f"/api/location/{location_id}")
    assert response.status_code == 200
    assert response.json()["message"] == f"Location with ID {location_id} deleted"
