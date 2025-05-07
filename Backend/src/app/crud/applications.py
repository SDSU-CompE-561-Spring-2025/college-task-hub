from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.applications import Applications

def get_application_by_user_and_task(db: Session, performer_id: int, task_id: int) -> Applications | None:
    return (
        db.query(Applications)
          .filter(Applications.performer_id == performer_id,
                  Applications.task_id == task_id)
          .first()
    )

def create_application(db: Session, performer_id: int, task_id: int) -> Applications:
    # guard against duplicates
    if get_application_by_user_and_task(db, performer_id, task_id):
        raise HTTPException(status_code=409, detail="Already applied")

    app_obj = Applications(performer_id=performer_id, task_id=task_id)
    db.add(app_obj)
    db.commit()
    db.refresh(app_obj)
    return app_obj

def get_applications_for_task(db: Session, task_id: int) -> list[Applications]:
    return db.query(Applications).filter(Applications.task_id == task_id).all()

def get_applications_for_user(db: Session, performer_id: int) -> list[Applications]:
    return db.query(Applications).filter(Applications.performer_id == performer_id).all()
