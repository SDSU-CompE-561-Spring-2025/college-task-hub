from app.schema.tasks import TasksCreate, TasksResponse
from app.crud import tasks as crud_tasks
from app.dependencies import get_db
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.middleware.logger import logger
from app.core.auth import get_current_user
from app.models.users import Users
from app.models.tasks import Tasks
from typing import List, Optional
from app.models.applications import Applications
from app.schema.applications import ApplicationResponse

router = APIRouter()

@router.post("/task",response_model=TasksResponse)
async def create_task(task_data: TasksCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Create a new task and add it to the database.
    task_data: TaskCreate - The data for the new task.
    Returns: A success message indicating the task was created.
    """
    logger.info('Creating new task')
    return crud_tasks.create_task(db=db, task_data=task_data, user_id=current_user.id)

@router.get("/task", response_model=List[TasksResponse])
async def get_tasks(category: Optional[str] = Query(None), db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Return a list of all current tasks in the database.
    Returns: A list of tasks.
    """
    if category:
        return db.query(Tasks).filter(Tasks.category == category).all()
    return db.query(Tasks).all()

@router.get("/task/mine", response_model=List[TasksResponse])
def get_my_tasks(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Get all tasks assigned to the current user.
    current_user: User - The current user making the request.
    db: Session - The database session.
    Returns: A list of tasks assigned to the current user.
    """
    return db.query(Tasks).filter(Tasks.user_id == current_user.id).all()

@router.get("/task/{task_id}", response_model=TasksResponse)
async def get_task(task_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Return a single task from the database by its ID.
    task_id: int - The ID of the task to retrieve.
    Returns: The task if found.
    """
    logger.info('Requesting task by ID')
    return crud_tasks.get_task(db=db, task_id=task_id)

@router.put("/task/{task_id}",response_model=TasksResponse)
async def update_task(task_id: int, task_data: TasksCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Update a single task's information in the database.
    task_id: int - The ID of the task to update.
    task_data: TaskCreate - The updated data for the task.
    Returns: A success message indicating the task was updated.
    """
    logger.info('Updating task')
    return crud_tasks.update_task(db=db, task_id=task_id, task_data=task_data)
    
@router.delete("/task/{task_id}",response_model=dict)
async def delete_task(task_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Delete a single task from the database.
    task_id: int - The ID of the task to delete.
    Returns: A success message indicating the task was deleted.
    """
    logger.info('Deleting task')
    return crud_tasks.delete_task(db=db, task_id=task_id)

@router.get("/tasks/{task_id}/applications", response_model=List[ApplicationResponse])
def get_applications_for_task(task_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Get all applications submitted for a specific task.
    """
    return db.query(Applications).filter(Applications.task_id == task_id).all()