# crud/tasks.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends
from app.models.tasks import Tasks
from app.schema.tasks import TasksCreate
from app.models.users import Users
from app.core.auth import get_current_user

# (Create) Create new task in the database
def create_task(db: Session, task_data: TasksCreate, user_id: int):
    db_task = Tasks(**task_data.dict(exclude={"user_id"}), user_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# (Read) Get all tasks from the database
def get_task(db: Session, task_id: int):
    task = db.query(Tasks).filter(Tasks.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

def get_tasks(db: Session):
    return db.query(Tasks).all()

# (Update) Update a task in the database
def update_task(db: Session, task_id: int, task_data: TasksCreate):
    task = get_task(db, task_id)
    for field, value in task_data.dict().items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task

# (Delete) Delete a task from the database
def delete_task(db: Session, task_id: int):
    task = get_task(db, task_id)
    db.delete(task)
    db.commit()
    return {"message": f"Task with ID {task_id} deleted"}
