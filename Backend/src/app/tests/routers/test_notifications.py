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

def create_test_task(client: TestClient, token: str):
    # Create a test task
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
    return response.json()["id"]

def test_create_notification(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
    task_id = create_test_task(client, token)
    
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": task_id
    }
    response = client.post(
        "/api/notification", 
        json=notification_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == notification_data["title"]
    assert data["message"] == notification_data["message"]

def test_get_notifications(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
    task_id = create_test_task(client, token)
    
    # First create a notification
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": task_id
    }
    client.post(
        "/api/notification", 
        json=notification_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    # Then get all notifications
    response = client.get(
        "/api/notification",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["title"] == notification_data["title"]

def test_get_notification_by_id(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
    task_id = create_test_task(client, token)
    
    # First create a notification
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": task_id
    }
    response = client.post(
        "/api/notification", 
        json=notification_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    notification_id = response.json()["id"]

    # Then get the notification by ID
    response = client.get(
        f"/api/notification/{notification_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == notification_data["title"]
    assert data["message"] == notification_data["message"]

def test_update_notification(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
    task_id = create_test_task(client, token)
    
    # First create a notification
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": task_id
    }
    response = client.post(
        "/api/notification", 
        json=notification_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    notification_id = response.json()["id"]

    # Then update the notification
    update_data = {
        "title": "Updated Notification",
        "message": "This is an updated notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": task_id
    }
    response = client.put(
        f"/api/notification/{notification_id}", 
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["message"] == update_data["message"]

def test_delete_notification(client: TestClient, db: Session):
    token = create_test_user_and_token(client, db)
    task_id = create_test_task(client, token)
    
    # First create a notification
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": task_id
    }
    response = client.post(
        "/api/notification", 
        json=notification_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    notification_id = response.json()["id"]

    # Then delete the notification
    response = client.delete(
        f"/api/notification/{notification_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == f"Notification with ID {notification_id} deleted"

    # Verify the notification is deleted
    response = client.get(
        f"/api/notification/{notification_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404 