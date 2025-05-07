from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.dependencies import get_db
from app.core.auth import get_current_user
from app.models.users import Users
from app.crud import applications as crud_applications
from app.schema.applications import ApplicationCreate, ApplicationResponse

router = APIRouter()

@router.post("/application", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
):
    """
    Apply the logged‑in performer (current_user) to the given task.
    application_data: ApplicationCreate (must include task_id)
    Returns: the created Application record.
    """
    try:
        return crud_applications.create_application(
            db, performer_id=current_user.id, task_id=application_data.task_id
        )
    except HTTPException as e:
        if e.status_code == status.HTTP_409_CONFLICT:
            # already applied
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        raise

@router.get("/application", response_model=List[ApplicationResponse])
async def get_applications(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
):
    """
    Return a list of all applications made by the current user.
    """
    return crud_applications.get_applications_for_user(db, performer_id=current_user.id)

@router.get("/application/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
):
    """
    Return a single application (must belong to current_user).
    """
    app_obj = crud_applications.get_application(db, performer_id=current_user.id, task_id=application_id)
    if not app_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return app_obj

@router.delete("/application/{application_id}", response_model=dict)
async def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user),
):
    """
    Withdraw (delete) a single application belonging to the current user.
    """
    app_obj = crud_applications.get_application(db, performer_id=current_user.id, task_id=application_id)
    if not app_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    crud_applications.delete_application(db, application_id=app_obj.id)
    return {"message": f"Application with ID {application_id} withdrawn"}
