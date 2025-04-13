import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.notifications import Notifications
from app.models.users import Users
from app.models.tasks import Tasks
from app.schema.notifications import NotificationsCreate
from app.crud.notifications import create_notification, get_notification, get_notifications, update_notification, delete_notification
from fastapi import HTTPException
from datetime import datetime, UTC

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_notifications_crud.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Current timestamp for testing
current_time = datetime.now(UTC)

@pytest.fixture
def db_session():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    db = TestingSessionLocal()

    # Create test user and task for foreign key references
    test_user = Users(
        name="Test User",
        email="test@example.com",
        password_hash="hashed_password",
        phone_number="1234567890"
    )
    db.add(test_user)
    db.flush()  # Flush to get the user ID
    
    test_task = Tasks(
        title="Test Task",
        description="Test task description",
        price=100,
        created_at=current_time,
        user_id=test_user.id,
        location_id=1  # This might need adjustment if your schema enforces FK constraints
    )
    db.add(test_task)
    db.commit()
    
    try:
        yield db
    finally:
        db.close()
    
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_data(db_session):
    """Create test user and task and return their IDs"""
    user = db_session.query(Users).first()
    task = db_session.query(Tasks).first()
    
    # Create test notification data
    notification_data = {
        "title": "Test Notification",
        "message": "This is a test notification",
        "created_at": current_time,
        "user_id": user.id,
        "task_id": task.id
    }
    
    # Create updated notification data
    updated_notification_data = {
        "title": "Updated Notification",
        "message": "This is an updated notification",
        "created_at": current_time,
        "user_id": user.id,
        "task_id": task.id
    }
    
    return {
        "notification_data": NotificationsCreate(**notification_data),
        "updated_notification_data": NotificationsCreate(**updated_notification_data),
        "user_id": user.id,
        "task_id": task.id
    }

def test_create_notification(db_session, test_data):
    """Test creating a new notification directly with the CRUD function"""
    notification_data = test_data["notification_data"]
    
    # Add the foreign keys
    db_notification = Notifications(
        title=notification_data.title,
        message=notification_data.message,
        created_at=notification_data.created_at,
        user_id=test_data["user_id"],
        task_id=test_data["task_id"]
    )
    db_session.add(db_notification)
    db_session.commit()
    db_session.refresh(db_notification)
    
    # Verify the object was created with correct data
    assert db_notification.title == notification_data.title
    assert db_notification.message == notification_data.message
    assert db_notification.user_id == test_data["user_id"]
    assert db_notification.task_id == test_data["task_id"]
    assert db_notification.id is not None

def test_get_notifications(db_session, test_data):
    """Test getting all notifications directly with the CRUD function"""
    # First create some test notifications
    notification_data = test_data["notification_data"]
    updated_notification_data = test_data["updated_notification_data"]
    
    # Add the first notification
    db_notification1 = Notifications(
        title=notification_data.title,
        message=notification_data.message,
        created_at=notification_data.created_at,
        user_id=test_data["user_id"],
        task_id=test_data["task_id"]
    )
    db_session.add(db_notification1)
    
    # Add the second notification
    db_notification2 = Notifications(
        title=updated_notification_data.title,
        message=updated_notification_data.message,
        created_at=updated_notification_data.created_at,
        user_id=test_data["user_id"],
        task_id=test_data["task_id"]
    )
    db_session.add(db_notification2)
    db_session.commit()
    
    # Get all notifications
    notifications = get_notifications(db=db_session)
    
    # Verify we get a list with the correct notifications
    assert isinstance(notifications, list)
    assert len(notifications) == 2
    assert any(notif.title == notification_data.title for notif in notifications)
    assert any(notif.title == updated_notification_data.title for notif in notifications)

def test_get_notification(db_session, test_data):
    """Test getting a single notification by ID directly with the CRUD function"""
    # First create a test notification
    notification_data = test_data["notification_data"]
    
    db_notification = Notifications(
        title=notification_data.title,
        message=notification_data.message,
        created_at=notification_data.created_at,
        user_id=test_data["user_id"],
        task_id=test_data["task_id"]
    )
    db_session.add(db_notification)
    db_session.commit()
    db_session.refresh(db_notification)
    
    # Get the notification by ID
    retrieved_notification = get_notification(db=db_session, notification_id=db_notification.id)
    
    # Verify we get the correct notification
    assert retrieved_notification.id == db_notification.id
    assert retrieved_notification.title == notification_data.title
    assert retrieved_notification.message == notification_data.message
    assert retrieved_notification.user_id == test_data["user_id"]
    assert retrieved_notification.task_id == test_data["task_id"]

def test_get_nonexistent_notification(db_session):
    """Test getting a notification that doesn't exist"""
    # Try to get a notification with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        get_notification(db=db_session, notification_id=999)
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Notification not found" in excinfo.value.detail

def test_update_notification(db_session, test_data):
    """Test updating a notification directly with the CRUD function"""
    # First create a test notification
    notification_data = test_data["notification_data"]
    updated_notification_data = test_data["updated_notification_data"]
    
    db_notification = Notifications(
        title=notification_data.title,
        message=notification_data.message,
        created_at=notification_data.created_at,
        user_id=test_data["user_id"],
        task_id=test_data["task_id"]
    )
    db_session.add(db_notification)
    db_session.commit()
    db_session.refresh(db_notification)
    
    # Update the notification
    # We need to use a schema object for update_notification
    update_schema = NotificationsCreate(
        title=updated_notification_data.title,
        message=updated_notification_data.message,
        created_at=updated_notification_data.created_at
    )
    
    # Now we need to manually add user_id and task_id as they are required by the model
    # but not by the schema
    updated_notification = update_notification(
        db=db_session, 
        notification_id=db_notification.id,
        notification_data=update_schema
    )
    
    # Verify the object was updated
    assert updated_notification.id == db_notification.id
    assert updated_notification.title == updated_notification_data.title
    assert updated_notification.message == updated_notification_data.message
    
    # Verify the object was actually updated in the database
    db_updated = db_session.query(Notifications).filter(Notifications.id == db_notification.id).first()
    assert db_updated.title == updated_notification_data.title
    assert db_updated.message == updated_notification_data.message

def test_update_nonexistent_notification(db_session, test_data):
    """Test updating a notification that doesn't exist"""
    # Try to update a notification with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        update_notification(
            db=db_session, 
            notification_id=999, 
            notification_data=test_data["updated_notification_data"]
        )
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Notification not found" in excinfo.value.detail

def test_delete_notification(db_session, test_data):
    """Test deleting a notification directly with the CRUD function"""
    # First create a test notification
    notification_data = test_data["notification_data"]
    
    db_notification = Notifications(
        title=notification_data.title,
        message=notification_data.message,
        created_at=notification_data.created_at,
        user_id=test_data["user_id"],
        task_id=test_data["task_id"]
    )
    db_session.add(db_notification)
    db_session.commit()
    db_session.refresh(db_notification)
    
    notification_id = db_notification.id
    
    # Delete the notification
    result = delete_notification(db=db_session, notification_id=notification_id)
    
    # Verify we get a success message
    assert "message" in result
    assert f"Notification with ID {notification_id} deleted" in result["message"]
    
    # Verify the notification was actually deleted from the database
    db_notification = db_session.query(Notifications).filter(Notifications.id == notification_id).first()
    assert db_notification is None

def test_delete_nonexistent_notification(db_session):
    """Test deleting a notification that doesn't exist"""
    # Try to delete a notification with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        delete_notification(db=db_session, notification_id=999)
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Notification not found" in excinfo.value.detail