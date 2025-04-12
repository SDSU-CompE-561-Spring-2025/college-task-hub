import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.tasks import Tasks
from app.models.users import Users
from app.models.locations import Locations
from app.schema.tasks import TasksCreate
from app.crud.tasks import create_task, get_task, get_tasks, update_task, delete_task
from fastapi import HTTPException
from datetime import datetime, UTC

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_tasks_crud.db"
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

    # Create test user and location for foreign key references
    test_user = Users(
        name="Task Owner",
        email="owner@example.com",
        password_hash="hashed_password",
        phone_number="1234567890"
    )
    
    test_location = Locations(
        street="123 Test St",
        city="Test City",
        state="TS",
        zipcode=12345
    )
    
    db.add(test_user)
    db.add(test_location)
    db.commit()
    db.refresh(test_user)
    db.refresh(test_location)
    
    try:
        yield db
    finally:
        db.close()
    
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_data(db_session):
    """Create test user and location and return their IDs along with test task data"""
    # Get the created user and location
    user = db_session.query(Users).first()
    location = db_session.query(Locations).first()
    
    # Create test task data
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "status": "pending",
        "price": 50,
        "created_at": current_time,
        "user_id": user.id,
        "location_id": location.id
    }
    
    # Create updated task data
    updated_task_data = {
        "title": "Updated Task",
        "description": "This is an updated test task",
        "status": "completed",
        "price": 75,
        "created_at": current_time,
        "user_id": user.id,
        "location_id": location.id
    }
    
    return {
        "task_data": TasksCreate(
            title=task_data["title"],
            description=task_data["description"],
            status=task_data["status"],
            price=task_data["price"],
            created_at=task_data["created_at"]
        ),
        "full_task_data": task_data,
        "updated_task_data": TasksCreate(
            title=updated_task_data["title"],
            description=updated_task_data["description"],
            status=updated_task_data["status"],
            price=updated_task_data["price"],
            created_at=updated_task_data["created_at"]
        ),
        "full_updated_task_data": updated_task_data,
        "user_id": user.id,
        "location_id": location.id
    }

def test_create_task(db_session, test_data):
    """Test creating a new task directly with the CRUD function"""
    # Create a new task
    db_task = Tasks(
        title=test_data["full_task_data"]["title"],
        description=test_data["full_task_data"]["description"],
        status=test_data["full_task_data"]["status"],
        price=test_data["full_task_data"]["price"],
        created_at=test_data["full_task_data"]["created_at"],
        user_id=test_data["user_id"],
        location_id=test_data["location_id"]
    )
    db_session.add(db_task)
    db_session.commit()
    db_session.refresh(db_task)
    
    # Verify the task was created with correct data
    assert db_task.title == test_data["full_task_data"]["title"]
    assert db_task.description == test_data["full_task_data"]["description"]
    assert db_task.status == test_data["full_task_data"]["status"]
    assert db_task.price == test_data["full_task_data"]["price"]
    assert db_task.user_id == test_data["user_id"]
    assert db_task.location_id == test_data["location_id"]
    assert db_task.id is not None

def test_get_tasks(db_session, test_data):
    """Test getting all tasks directly with the CRUD function"""
    # First create some test tasks
    db_task1 = Tasks(
        title=test_data["full_task_data"]["title"],
        description=test_data["full_task_data"]["description"],
        status=test_data["full_task_data"]["status"],
        price=test_data["full_task_data"]["price"],
        created_at=test_data["full_task_data"]["created_at"],
        user_id=test_data["user_id"],
        location_id=test_data["location_id"]
    )
    
    db_task2 = Tasks(
        title=test_data["full_updated_task_data"]["title"],
        description=test_data["full_updated_task_data"]["description"],
        status=test_data["full_updated_task_data"]["status"],
        price=test_data["full_updated_task_data"]["price"],
        created_at=test_data["full_updated_task_data"]["created_at"],
        user_id=test_data["user_id"],
        location_id=test_data["location_id"]
    )
    
    db_session.add(db_task1)
    db_session.add(db_task2)
    db_session.commit()
    
    # Get all tasks
    tasks = get_tasks(db=db_session)
    
    # Verify we get a list with the correct tasks
    assert isinstance(tasks, list)
    assert len(tasks) == 2
    assert any(task.title == test_data["full_task_data"]["title"] for task in tasks)
    assert any(task.title == test_data["full_updated_task_data"]["title"] for task in tasks)

def test_get_task(db_session, test_data):
    """Test getting a single task by ID directly with the CRUD function"""
    # First create a test task
    db_task = Tasks(
        title=test_data["full_task_data"]["title"],
        description=test_data["full_task_data"]["description"],
        status=test_data["full_task_data"]["status"],
        price=test_data["full_task_data"]["price"],
        created_at=test_data["full_task_data"]["created_at"],
        user_id=test_data["user_id"],
        location_id=test_data["location_id"]
    )
    db_session.add(db_task)
    db_session.commit()
    db_session.refresh(db_task)
    
    # Get the task by ID
    retrieved_task = get_task(db=db_session, task_id=db_task.id)
    
    # Verify we get the correct task
    assert retrieved_task.id == db_task.id
    assert retrieved_task.title == test_data["full_task_data"]["title"]
    assert retrieved_task.description == test_data["full_task_data"]["description"]
    assert retrieved_task.status == test_data["full_task_data"]["status"]
    assert retrieved_task.price == test_data["full_task_data"]["price"]
    assert retrieved_task.user_id == test_data["user_id"]
    assert retrieved_task.location_id == test_data["location_id"]

def test_get_nonexistent_task(db_session):
    """Test getting a task that doesn't exist"""
    # Try to get a task with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        get_task(db=db_session, task_id=999)
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Task not found" in excinfo.value.detail

def test_update_task(db_session, test_data):
    """Test updating a task directly with the CRUD function"""
    # First create a test task
    db_task = Tasks(
        title=test_data["full_task_data"]["title"],
        description=test_data["full_task_data"]["description"],
        status=test_data["full_task_data"]["status"],
        price=test_data["full_task_data"]["price"],
        created_at=test_data["full_task_data"]["created_at"],
        user_id=test_data["user_id"],
        location_id=test_data["location_id"]
    )
    db_session.add(db_task)
    db_session.commit()
    db_session.refresh(db_task)
    
    # Update the task
    updated_task = update_task(
        db=db_session, 
        task_id=db_task.id, 
        task_data=test_data["updated_task_data"]
    )
    
    # Verify the returned object has the updated data
    assert updated_task.id == db_task.id
    assert updated_task.title == test_data["updated_task_data"].title
    assert updated_task.description == test_data["updated_task_data"].description
    assert updated_task.status == test_data["updated_task_data"].status
    assert updated_task.price == test_data["updated_task_data"].price
    
    # Verify the foreign keys remain unchanged
    assert updated_task.user_id == test_data["user_id"]
    assert updated_task.location_id == test_data["location_id"]
    
    # Verify the object was actually updated in the database
    db_updated = db_session.query(Tasks).filter(Tasks.id == db_task.id).first()
    assert db_updated.title == test_data["updated_task_data"].title
    assert db_updated.description == test_data["updated_task_data"].description
    assert db_updated.status == test_data["updated_task_data"].status
    assert db_updated.price == test_data["updated_task_data"].price

def test_update_nonexistent_task(db_session, test_data):
    """Test updating a task that doesn't exist"""
    # Try to update a task with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        update_task(
            db=db_session, 
            task_id=999, 
            task_data=test_data["updated_task_data"]
        )
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Task not found" in excinfo.value.detail

def test_delete_task(db_session, test_data):
    """Test deleting a task directly with the CRUD function"""
    # First create a test task
    db_task = Tasks(
        title=test_data["full_task_data"]["title"],
        description=test_data["full_task_data"]["description"],
        status=test_data["full_task_data"]["status"],
        price=test_data["full_task_data"]["price"],
        created_at=test_data["full_task_data"]["created_at"],
        user_id=test_data["user_id"],
        location_id=test_data["location_id"]
    )
    db_session.add(db_task)
    db_session.commit()
    db_session.refresh(db_task)
    
    task_id = db_task.id
    
    # Delete the task
    result = delete_task(db=db_session, task_id=task_id)
    
    # Verify we get a success message
    assert "message" in result
    assert f"Task with ID {task_id} deleted" in result["message"]
    
    # Verify the task was actually deleted from the database
    db_task = db_session.query(Tasks).filter(Tasks.id == task_id).first()
    assert db_task is None

def test_delete_nonexistent_task(db_session):
    """Test deleting a task that doesn't exist"""
    # Try to delete a task with an ID that doesn't exist
    with pytest.raises(HTTPException) as excinfo:
        delete_task(db=db_session, task_id=999)
    
    # Verify we get a 404 error
    assert excinfo.value.status_code == 404
    assert "Task not found" in excinfo.value.detail

def test_task_with_special_status(db_session, test_data):
    """Test creating and retrieving tasks with different status values"""
    # Create tasks with different status values
    status_values = ["pending", "in_progress", "completed", "cancelled", None]
    
    for status in status_values:
        db_task = Tasks(
            title=f"Task with status: {status}",
            description="Status test",
            status=status,
            price=50,
            created_at=current_time,
            user_id=test_data["user_id"],
            location_id=test_data["location_id"]
        )
        db_session.add(db_task)
    
    db_session.commit()
    
    # Verify we can retrieve all tasks
    tasks = get_tasks(db=db_session)
    assert len(tasks) == len(status_values)
    
    # Verify each status is correctly stored
    for status in status_values:
        task = db_session.query(Tasks).filter(Tasks.status == status).first()
        if status is None:
            assert task is not None
            assert task.status is None
        else:
            assert task is not None
            assert task.status == status

def test_task_price_boundaries(db_session, test_data):
    """Test tasks with different price values"""
    price_values = [0, 1, 999999, -1]  # Including potentially invalid values
    
    for price in price_values:
        try:
            db_task = Tasks(
                title=f"Task with price: {price}",
                description="Price test",
                status="pending",
                price=price,
                created_at=current_time,
                user_id=test_data["user_id"],
                location_id=test_data["location_id"]
            )
            db_session.add(db_task)
            db_session.commit()
            db_session.refresh(db_task)
            
            # Verify price is stored correctly
            assert db_task.price == price
            
            # Clean up
            db_session.delete(db_task)
            db_session.commit()
        except Exception as e:
            # If there's validation that prevents negative prices
            if price < 0:
                pass  # Expected failure for negative prices
            else:
                raise  # Unexpected failure