from fastapi.testclient import TestClient
from app.routers import ratings

# Testing
# Create a TestClient instance for the Tasks API endpoints
client = TestClient(ratings.router)

def test_post_ratings():
    """
    Test the POST /rating endpoint.
    """
    # Define the request payload
    payload = {
        "user_id": 1,
        "task_id": 1,
        "rating": 5
    }

    # Send a POST request to the endpoint
    response = client.post("/rating", json=payload)

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": "Rating created", "Info": payload} #nosec

def test_get_ratings():
    """
    Test the GET /rating/{rating_id} endpoint.
    """
    # Define the rating ID to retrieve
    rating_id = 1

    # Send a GET request to the endpoint
    response = client.get(f"/rating/{rating_id}")

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"Rating with ID {rating_id} retrieved"} #nosec

def test_put_ratings():
    """
    Test the PUT /rating/{rating_id} endpoint.
    """
    # Define the rating ID to update
    rating_id = 1

    # Define the request payload
    payload = {
        "user_id": 1,
        "task_id": 1,
        "rating": 4
    }

    # Send a PUT request to the endpoint with a rating ID of 1
    response = client.put(f"/rating/{rating_id}", json=payload)

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"Rating with ID {rating_id} updated", "data": payload} #nosec

def test_delete_ratings():
    """
    Test the DELETE /rating/{rating_id} endpoint.
    """
    # Define the rating ID to delete
    rating_id = 1

    # Send a DELETE request to the endpoint with a rating ID of 1
    response = client.delete(f"/rating/{rating_id}")

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"Rating with ID {rating_id} deleted"} #nosec
