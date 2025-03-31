from fastapi.testclient import TestClient
from app.routers import locations

# Create a TestClient instance for the Tasks API endpoints
client = TestClient(locations.router)

def test_post_locations():
    """
    Test the POST /location endpoint.
    """
    # Define the request payload
    payload = {
        "street": "Test Street",
        "city": "Test City"
    }

    # Send a POST request to the endpoint
    response = client.post("/location", json=payload)

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": "Location created", "Info": payload} #nosec

def test_get_locations():
    """
    Test the GET /location endpoint.
    """
    # Send a GET request to the endpoint
    response = client.get("/location")

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": "List of locations"} #nosec

def test_put_locations():
    """
    Test the PUT /location endpoint.
    """
    # Define the location ID to update
    location_id = 1

    # Define the request payload
    payload = {
        "street": "Updated Location",
        "city": "Updated City"
    }

    # Send a PUT request to the endpoint with a location ID of 1
    response = client.put(f"/location/{location_id}", json=payload)

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"Location with ID {location_id} updated", "data": payload} #nosec

def test_delete_locations():
    """
    Test the DELETE /location{location_id} endpoint.
    """
    # Define the location ID to delete
    location_id = 1

    # Send a DELETE request to the endpoint with a location ID of 1
    response = client.delete(f"/location/{location_id}")

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"Location with ID {location_id} deleted"} #nosec
