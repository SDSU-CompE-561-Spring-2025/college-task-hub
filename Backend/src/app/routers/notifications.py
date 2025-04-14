from app.dependencies import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schema.notifications import NotificationsCreate, NotificationsResponse
from app.crud import notifications as crud_notifications
from app.middleware.logger import logger
from app.core.auth import get_current_user
from app.models.users import Users

router = APIRouter()

@router.post("/notification",response_model=NotificationsResponse)
async def create_notification(notification_data: NotificationsCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Create a new notification and add it to the database.
    notification_data: NotificationCreate - The data for the new notification.
    Returns: A success message indicating the notification was created.
    """
    logger.info('Creating new notification')
    return crud_notifications.create_notification(db=db, notification_data=notification_data)

@router.get("/notification",response_model=list[NotificationsResponse])
async def get_notifications(db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Return a list of all current notifications in the database.
    Returns: A list of notifications.
    """
    logger.info('Requesting notifications')
    return crud_notifications.get_notifications(db=db)

@router.get("/notification/{notification_id}", response_model=NotificationsResponse)
async def get_notification(notification_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Return a single notification by its ID.
    notification_id: int - The ID of the notification to retrieve.
    Returns: The notification if found, otherwise raises a 404 error.
    """
    logger.info('Requesting notification by ID')
    return crud_notifications.get_notification(db=db, notification_id=notification_id)
   
@router.put("/notification/{notification_id}",response_model=NotificationsResponse)
async def update_notification(notification_id: int, notification_data: NotificationsCreate, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Update a single notification's information in the database.
    notification_id: int - The ID of the notification to update.
    notification_data: NotificationCreate - The updated data for the notification.
    Returns: A success message indicating the notification was updated.
    """
    logger.info('Updating notification')
    return crud_notifications.update_notification(db=db, notification_id=notification_id, notification_data=notification_data)

@router.delete("/notification/{notification_id}",response_model=dict)
async def delete_notification(notification_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    """
    Delete a single notification from the database.
    notification_id: int - The ID of the notification to delete.
    Returns: A success message indicating the notification was deleted.
    """
    logger.info('Deleting notification')
    return crud_notifications.delete_notification(db=db, notification_id=notification_id)