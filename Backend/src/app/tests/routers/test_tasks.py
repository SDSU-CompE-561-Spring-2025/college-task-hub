from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime
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

def test_create_task(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
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

def test_get_tasks(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
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
    assert len(data) > 0
    assert data[0]["title"] == task_data["title"]

def test_get_task_by_id(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
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

    # Then get the task by ID
    response = client.get(
        f"/api/task/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]

def test_update_task(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
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

    # Then update the task
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

def test_delete_task(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
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

    # Then delete the task
    response = client.delete(
        f"/api/task/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == f"Task with ID {task_id} deleted"

    # Verify the task is deleted
    response = client.get(
        f"/api/task/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
