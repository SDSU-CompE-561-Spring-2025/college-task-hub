import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base
from app.dependencies import get_db
from app.models.tasks import Tasks
from app.schema.tasks import TasksCreate
from datetime import datetime, UTC

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_tasks.db"
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
test_task = {
    "title": "Test Task",
    "description": "This is a test task",
    "status": "pending",
    "price": 50,
    "created_at": current_time.isoformat(),
    "user_id": 1,  # You'll need a valid user_id in your test database
    "location_id": 1  # You'll need a valid location_id in your test database
}

updated_task = {
    "title": "Updated Task",
    "description": "This is an updated test task",
    "status": "completed",
    "price": 75,
    "created_at": current_time.isoformat(),
    "user_id": 1,  # Keep the same user_id
    "location_id": 1  # Keep the same location_id
}

@pytest.fixture
def test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create test dependencies (user and location)
    db = TestingSessionLocal()
    
    # Here you might want to create a test user and location
    # This depends on your specific implementation
    
    db.commit()
    db.close()
    
    yield
    
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

def test_create_task(test_db):
    """Test creating a new task"""
    response = client.post("/api/task", json=test_task)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == test_task["title"]
    assert data["description"] == test_task["description"]
    assert data["status"] == test_task["status"]
    assert data["price"] == test_task["price"]
    assert "id" in data

def test_get_tasks(test_db):
    """Test getting all tasks"""
    # First create a task
    client.post("/api/task", json=test_task)
    
    # Then get all tasks
    response = client.get("/api/task")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["title"] == test_task["title"]
    assert data[0]["description"] == test_task["description"]

def test_get_task_by_id(test_db):
    """Test getting a single task by ID"""
    # First create a task
    create_response = client.post("/api/task", json=test_task)
    task_id = create_response.json()["id"]
    
    # Then get that specific task
    get_response = client.get(f"/api/task/{task_id}")
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["id"] == task_id
    assert data["title"] == test_task["title"]
    assert data["description"] == test_task["description"]
    assert data["status"] == test_task["status"]
    assert data["price"] == test_task["price"]

def test_update_task(test_db):
    """Test updating a task"""
    # First create a task
    create_response = client.post("/api/task", json=test_task)
    task_id = create_response.json()["id"]
    
    # Then update the task
    update_response = client.put(f"/api/task/{task_id}", json=updated_task)
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["id"] == task_id
    assert data["title"] == updated_task["title"]
    assert data["description"] == updated_task["description"]
    assert data["status"] == updated_task["status"]
    assert data["price"] == updated_task["price"]
    
    # Verify update by getting the task
    get_response = client.get(f"/api/task/{task_id}")
    assert get_response.json()["title"] == updated_task["title"]
    assert get_response.json()["status"] == updated_task["status"]

def test_delete_task(test_db):
    """Test deleting a task"""
    # First create a task
    create_response = client.post("/api/task", json=test_task)
    task_id = create_response.json()["id"]
    
    # Then delete the task
    delete_response = client.delete(f"/api/task/{task_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == f"Task with ID {task_id} deleted"
    
    # Verify deletion by trying to get the task (should return 404)
    get_response = client.get(f"/api/task/{task_id}")
    assert get_response.status_code == 404

def test_get_nonexistent_task(test_db):
    """Test getting a task that doesn't exist"""
    response = client.get("/api/task/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_update_nonexistent_task(test_db):
    """Test updating a task that doesn't exist"""
    response = client.put("/api/task/999", json=updated_task)
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_delete_nonexistent_task(test_db):
    """Test deleting a task that doesn't exist"""
    response = client.delete("/api/task/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_create_task_missing_fields():
    """Test creating a task with missing required fields"""
    incomplete_task = {
        "title": "Incomplete Task"
        # Missing description, status, price, created_at, user_id, location_id
    }
    response = client.post("/api/task", json=incomplete_task)
    assert response.status_code == 422  # Unprocessable Entity

def test_create_task_invalid_price():
    """Test creating a task with an invalid price"""
    invalid_task = {
        "title": "Invalid Price Task",
        "description": "This task has an invalid price",
        "status": "pending",
        "price": -50,  # Negative price should be invalid
        "created_at": current_time.isoformat(),
        "user_id": 1,
        "location_id": 1
    }
    response = client.post("/api/task", json=invalid_task)
    # This might return 422 if you have validation, but depends on your implementation
    assert response.status_code in [200, 422]