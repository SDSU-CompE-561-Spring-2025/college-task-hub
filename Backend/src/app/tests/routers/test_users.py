from fastapi.testclient import TestClient
from app.routers import users

# Create a TestClient instance for the Users API endpoints
client = TestClient(users.router)

def test_post_users():
    """
    Test the POST /user endpoint.
    """
    # Define the request payload
    payload = {
        "username": "123User",
        "email": "user@123.com"
    }

    # Send a POST request to the endpoint
    response = client.post("/user", json=payload)

    # Assert the response status code and content
    assert response.status_code == 200 #nosec
    assert response.json() == {"message": "User created", "Info": payload} #nosec


def test_get_users():
    """
    Test the GET /user endpoint.
    """
    # Send a GET request to the endpoint
    response = client.get("/user")

    # Assert the response status code and content
    assert response.status_code == 200 #nosec
    assert response.json() == {"message": "List of users"} #nosec

def test_put_users():
    """
    Test the PUT /user/{user_id} endpoint.
    """
    # Define the user ID to update
    user_id = 1

    # Define the request payload
    payload = {
        "username": "123UpdateUser",
        "email": "updateUser@123.com"
    }

    response = client.put(f"/user/{user_id}", json=payload)

    # Assert the response status code and content
    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"User with ID {user_id} updated", "data": payload} #nosec

def test_delete_users():
    """
    Test the DELETE /user/{user_id} endpoint.
    """
    # Define the user ID to delete
    user_id = 1

    # Send a DELETE request to the endpoint
    response = client.delete(f"/user/{user_id}")

    # Assert the response status code and content
    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"User with ID {user_id} deleted"} #nosec
