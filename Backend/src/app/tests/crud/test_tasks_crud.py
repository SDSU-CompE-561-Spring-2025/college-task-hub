from sqlalchemy.orm import Session
from app.models.tasks import Tasks
from app.schema.tasks import TasksCreate
from datetime import datetime

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

def test_create_task(client, db: Session):
    token = get_auth_token(client)
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "status": "pending",
        "price": 100,
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "location_id": 1
    }
    response = client.post(
        "/api/task", 
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert data["status"] == task_data["status"]
    assert data["price"] == task_data["price"]
    assert "id" in data

def test_get_task(client, db: Session):
    token = get_auth_token(client)
    # First create a task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "status": "pending",
        "price": 100,
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "location_id": 1
    }
    response = client.post(
        "/api/task", 
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = response.json()["id"]

    # Then get it
    response = client.get(
        f"/api/task/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert data["status"] == task_data["status"]
    assert data["price"] == task_data["price"]

def test_get_tasks(client, db: Session):
    token = get_auth_token(client)
    # First create a task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "status": "pending",
        "price": 100,
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "location_id": 1
    }
    client.post(
        "/api/task", 
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    # Then get all tasks
    response = client.get(
        "/api/task",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["title"] == task_data["title"]

def test_update_task(client, db: Session):
    token = get_auth_token(client)
    # First create a task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "status": "pending",
        "price": 100,
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "location_id": 1
    }
    response = client.post(
        "/api/task", 
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = response.json()["id"]

    # Then update it
    update_data = {
        "title": "Updated Task",
        "description": "This is an updated task",
        "status": "in_progress",
        "price": 150,
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "location_id": 1
    }
    response = client.put(
        f"/api/task/{task_id}", 
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["description"] == update_data["description"]
    assert data["status"] == update_data["status"]
    assert data["price"] == update_data["price"]

def test_delete_task(client, db: Session):
    token = get_auth_token(client)
    # First create a task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "status": "pending",
        "price": 100,
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "location_id": 1
    }
    response = client.post(
        "/api/task", 
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = response.json()["id"]

    # Then delete it
    response = client.delete(
        f"/api/task/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == f"Task with ID {task_id} deleted"

    # Verify deletion
    response = client.get(
        f"/api/task/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404

def test_get_nonexistent_task(client, db: Session):
    token = get_auth_token(client)
    response = client.get(
        "/api/task/999",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_update_nonexistent_task(client, db: Session):
    token = get_auth_token(client)
    update_data = {
        "title": "Updated Task",
        "description": "This is an updated task",
        "status": "in_progress",
        "price": 150,
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "location_id": 1
    }
    response = client.put(
        "/api/task/999", 
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_delete_nonexistent_task(client, db: Session):
    token = get_auth_token(client)
    response = client.delete(
        "/api/task/999",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_create_task_missing_fields(client, db: Session):
    token = get_auth_token(client)
    incomplete_task = {
        "title": "Incomplete Task",
        "description": "This task is missing fields"
        # Missing required fields: price, created_at, user_id, location_id
    }
    response = client.post(
        "/api/task", 
        json=incomplete_task,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422  # Unprocessable Entity

def test_create_task_invalid_price(client, db: Session):
    token = get_auth_token(client)
    invalid_task = {
        "title": "Invalid Task",
        "description": "This task has invalid price",
        "status": "pending",
        "price": -100,  # Negative price
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "location_id": 1
    }
    response = client.post(
        "/api/task", 
        json=invalid_task,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422  # Unprocessable Entity
