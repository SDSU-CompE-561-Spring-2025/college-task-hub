# crud/tasks.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends
from app.models.tasks import Tasks
from app.schema.tasks import TasksCreate
from app.models.users import Users
from app.core.auth import get_current_user
from sqlalchemy import func
from sqlalchemy.orm import aliased
from app.models.applications import Applications


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

def get_tasks_with_apply_flag(db: Session, performer_id: int):
    """
    Return all tasks, with an extra `has_applied` key
    indicating whether `performer_id` has applied to each one.
    """
    app_alias = aliased(Applications)
    q = (
        db.query(
            Tasks,
            func.count(app_alias.id).label("app_count")
        )
        .outerjoin(
            app_alias,
            (app_alias.task_id == Tasks.id) &
            (app_alias.performer_id == performer_id)
        )
        .group_by(Tasks.id)
    )

    results = []
    for task_obj, row in q:
        # task_obj.__dict__ has SQLAlchemy internals – strip them off:
        task_data = {k: v for k, v in task_obj.__dict__.items() if not k.startswith("_")}
        task_data["has_applied"] = row.app_count > 0
        results.append(task_data)

    return results


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
