import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base
from app.dependencies import get_db
from app.models.notifications import Notifications
from app.schema.notifications import NotificationsCreate
from datetime import datetime, UTC

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_notifications.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the tables
Base.metadata.create_all(bind=engine)

# Override the dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

# Current timestamp for testing
current_time = datetime.now(UTC)

# Test data
test_notification = {
    "title": "Test Notification",
    "message": "This is a test notification",
    "created_at": current_time.isoformat()
}

updated_notification = {
    "title": "Updated Notification",
    "message": "This is an updated notification",
    "created_at": current_time.isoformat()
}

@pytest.fixture
def test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

def test_create_notification(test_db):
    """Test creating a new notification"""
    response = client.post("/api/notification", json=test_notification)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == test_notification["title"]
    assert data["message"] == test_notification["message"]
    assert "id" in data

def test_get_notifications(test_db):
    """Test getting all notifications"""
    # First create a notification
    client.post("/api/notification", json=test_notification)
    
    # Then get all notifications
    response = client.get("/api/notification")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["title"] == test_notification["title"]
    assert data[0]["message"] == test_notification["message"]

def test_get_notification_by_id(test_db):
    """Test getting a single notification by ID"""
    # First create a notification
    create_response = client.post("/api/notification", json=test_notification)
    notification_id = create_response.json()["id"]
    
    # Then get that specific notification
    get_response = client.get(f"/api/notification/{notification_id}")
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["id"] == notification_id
    assert data["title"] == test_notification["title"]
    assert data["message"] == test_notification["message"]

def test_update_notification(test_db):
    """Test updating a notification"""
    # First create a notification
    create_response = client.post("/api/notification", json=test_notification)
    notification_id = create_response.json()["id"]
    
    # Then update the notification
    update_response = client.put(f"/api/notification/{notification_id}", json=updated_notification)
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["id"] == notification_id
    assert data["title"] == updated_notification["title"]
    assert data["message"] == updated_notification["message"]
    
    # Verify update by getting the notification
    get_response = client.get(f"/api/notification/{notification_id}")
    assert get_response.json()["title"] == updated_notification["title"]

def test_delete_notification(test_db):
    """Test deleting a notification"""
    # First create a notification
    create_response = client.post("/api/notification", json=test_notification)
    notification_id = create_response.json()["id"]
    
    # Then delete the notification
    delete_response = client.delete(f"/api/notification/{notification_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == f"Notification with ID {notification_id} deleted"
    
    # Verify deletion by trying to get the notification (should return 404)
    get_response = client.get(f"/api/notification/{notification_id}")
    assert get_response.status_code == 404

def test_get_nonexistent_notification(test_db):
    """Test getting a notification that doesn't exist"""
    response = client.get("/api/notification/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Notification not found"

def test_update_nonexistent_notification(test_db):
    """Test updating a notification that doesn't exist"""
    response = client.put("/api/notification/999", json=updated_notification)
    assert response.status_code == 404
    assert response.json()["detail"] == "Notification not found"

def test_delete_nonexistent_notification(test_db):
    """Test deleting a notification that doesn't exist"""
    response = client.delete("/api/notification/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Notification not found"

def test_create_notification_missing_fields():
    """Test creating a notification with missing required fields"""
    incomplete_notification = {
        "title": "Incomplete Notification"
        # Missing message and created_at
    }
    response = client.post("/api/notification", json=incomplete_notification)
    assert response.status_code == 422  # Unprocessable Entity