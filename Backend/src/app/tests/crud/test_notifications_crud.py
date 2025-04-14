from sqlalchemy.orm import Session
from app.models.notifications import Notifications
from app.schema.notifications import NotificationsCreate
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

def test_create_notification(client, db: Session):
    token = get_auth_token(client)
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": 1
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

def test_get_notification(client, db: Session):
    token = get_auth_token(client)
    # First create a notification
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": 1
    }
    response = client.post(
        "/api/notification", 
        json=notification_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    notification_id = response.json()["id"]

    # Then get it
    response = client.get(
        f"/api/notification/{notification_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == notification_data["title"]

def test_update_notification(client, db: Session):
    token = get_auth_token(client)
    # First create a notification
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": 1
    }
    response = client.post(
        "/api/notification", 
        json=notification_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    notification_id = response.json()["id"]

    # Then update it
    update_data = {
        "title": "Updated Notification",
        "message": "This is an updated notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": 1
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

def test_delete_notification(client, db: Session):
    token = get_auth_token(client)
    # First create a notification
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "created_at": datetime.now().isoformat(),
        "user_id": 1,
        "task_id": 1
    }
    response = client.post(
        "/api/notification", 
        json=notification_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    notification_id = response.json()["id"]

    # Then delete it
    response = client.delete(
        f"/api/notification/{notification_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == f"Notification with ID {notification_id} deleted" 