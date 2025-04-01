from fastapi.testclient import TestClient
from app.routers import notifications

# Create a TestClient instance for the Tasks API endpoints
client = TestClient(notifications.router)

def test_post_notifications():
    """
    Test the POST /notification endpoint.
    """
    # Define the request payload
    payload = {
        "title": "Test Complete",
        "message": "This a test notification.",
    }

    # Send a POST request to the endpoint
    response = client.post("/notification", json=payload)

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": "Notification created", "Info": payload} #nosec

def test_get_notifications():
    """
    Test the GET /notification endpoint.
    """
    # Send a GET request to the endpoint
    response = client.get("/notification")

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": "List of notifications"} #nosec

def test_put_notifications():
    """
    Test the PUT /notification/{notification_id} endpoint.
    """
    # Define the notification ID to update
    notification_id = 1

    # Define the request payload
    payload = {
        "title": "Updated Notification",
        "message": "This is an updated test notification.",
    }

    # Send a PUT request to the endpoint with a notification ID of 1
    response = client.put(f"/notification/{notification_id}", json=payload)

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"Notification with ID {notification_id} updated", "data": payload} #nosec

def test_delete_notifications():
    """
    Test the DELETE /notification/{notification_id} endpoint.
    """
    # Define the notification ID to delete
    notification_id = 1

    # Send a DELETE request to the endpoint with a notification ID of 1
    response = client.delete(f"/notification/{notification_id}")

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"Notification with ID {notification_id} deleted"} #nosec
