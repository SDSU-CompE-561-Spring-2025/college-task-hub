from fastapi import APIRouter
from app.schema.tasks import TasksCreate, TasksResponse

router = APIRouter()

@router.post("/task",response_model=TasksResponse)
async def create_task(task_data: TasksCreate):
    """
    Create a new task and add it to the database.
    task_data: TaskCreate - The data for the new task.
    Returns: A success message indicating the task was created.
    """
    return TasksResponse(
        id = 1, #placeholder 
        title=task_data.title,
        description=task_data.description,
        status = task_data.status,
        price = task_data.price,
        created_at = task_data.created_at
    )

@router.get("/task",response_model=list[TasksResponse])
async def get_tasks():
    """
    Return a list of all current tasks in the database.
    Returns: A list of tasks.
    """
    return [
        TasksResponse(
            id=1, # Placeholder ID
            title="Task1",
            description="Description1",
            status="Pending",
            price=70,
            created_at="2025-01-01T12:00:00"
        ),
        TasksResponse(
            id=2, # Placeholder ID
            title="Task2",
            description="Description2",
            status="Completed",
            price=100,
            created_at="2024-10-02T12:00:00"
        )
    ]

@router.put("/task/{task_id}",response_model=TasksResponse)
async def update_task(task_id: int, task_data: TasksCreate):
    """
    Update a single task's information in the database.
    task_id: int - The ID of the task to update.
    task_data: TaskCreate - The updated data for the task.
    Returns: A success message indicating the task was updated.
    """
    return TasksResponse(
        id=task_id,
        title=task_data.title,
        description=task_data.description,
        status = task_data.status,
        price = task_data.price,
        created_at = task_data.created_at
    )

@router.delete("/task/{task_id}",response_model=dict)
async def delete_task(task_id: int):
    """
    Delete a single task from the database.
    task_id: int - The ID of the task to delete.
    Returns: A success message indicating the task was deleted.
    """
    return {"message": f"Task with ID {task_id} deleted"}
