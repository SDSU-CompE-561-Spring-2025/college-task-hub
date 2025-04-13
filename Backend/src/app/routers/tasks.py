from app.schema.tasks import TasksCreate, TasksResponse
from app.crud import tasks as crud_tasks
from app.dependencies import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.middleware.logger import logger

router = APIRouter()

@router.post("/task",response_model=TasksResponse)
async def create_task(task_data: TasksCreate, db: Session = Depends(get_db)):
    """
    Create a new task and add it to the database.
    task_data: TaskCreate - The data for the new task.
    Returns: A success message indicating the task was created.
    """
    logger.info('Creating new task')
    return crud_tasks.create_task(db=db, task_data=task_data)

@router.get("/task",response_model=list[TasksResponse])
async def get_tasks(db: Session = Depends(get_db)):
    """
    Return a list of all current tasks in the database.
    Returns: A list of tasks.
    """
    logger.info('Requesting list of tasks')
    return crud_tasks.get_tasks(db=db)

@router.get("/task/{task_id}", response_model=TasksResponse)
async def get_task(task_id: int, db: Session = Depends(get_db)):
    """
    Return a single task from the database by its ID.
    task_id: int - The ID of the task to retrieve.
    Returns: The task if found.
    """
    logger.info('Requesting task by ID')
    return crud_tasks.get_task(db=db, task_id=task_id)

@router.put("/task/{task_id}",response_model=TasksResponse)
async def update_task(task_id: int, task_data: TasksCreate, db: Session = Depends(get_db)):
    """
    Update a single task's information in the database.
    task_id: int - The ID of the task to update.
    task_data: TaskCreate - The updated data for the task.
    Returns: A success message indicating the task was updated.
    """
    logger.info('Updating task')
    return crud_tasks.update_task(db=db, task_id=task_id, task_data=task_data)
    
@router.delete("/task/{task_id}",response_model=dict)
async def delete_task(task_id: int,db: Session = Depends(get_db)):
    """
    Delete a single task from the database.
    task_id: int - The ID of the task to delete.
    Returns: A success message indicating the task was deleted.
    """
    logger.info('Deleting task')
    return crud_tasks.delete_task(db=db, task_id=task_id)