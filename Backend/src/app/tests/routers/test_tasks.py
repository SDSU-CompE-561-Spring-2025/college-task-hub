from fastapi.testclient import TestClient
from app.routers import tasks

# Create a TestClient instance for the Tasks API endpoints
client = TestClient(tasks.router)

def test_post_tasks():
    """
    Test the POST /task endpoint.
    """
    # Define the request payload
    payload = {
        "title": "Test Task",
        "description": "This is a test task."
    }

    # Send a POST request to the endpoint
    response = client.post("/task", json=payload)

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": "Task created", "Info": payload} #nosec

def test_get_tasks():
    """
    Test the GET /task endpoint.
    """
    # Send a GET request to the endpoint
    response = client.get("/task")

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": "List of tasks"} #nosec

def test_put_tasks():
    """
    Test the PUT /task/{task_id} endpoint.
    """
    # Define the task ID to update
    task_id = 1

    # Define the request payload
    payload = {
        "title": "Updated Task",
        "description": "This is an updated test task."
    }

    # Send a PUT request to the endpoint with a task ID of 1
    response = client.put(f"/task/{task_id}", json=payload)

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"Task with ID {task_id} updated", "data": payload} #nosec

def test_delete_tasks():
    """
    Test the DELETE /task/{task_id} endpoint.
    """
    # Define the task ID to delete
    task_id = 1

    # Send a DELETE request to the endpoint with a task ID of 1
    response = client.delete(f"/task/{task_id}")

    assert response.status_code == 200 #nosec
    assert response.json() == {"message": f"Task with ID {task_id} deleted"} #nosec
