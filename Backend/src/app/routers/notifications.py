from fastapi import APIRouter
from app.schema.notifications import NotificationsCreate, NotificationsResponse

router = APIRouter()

@router.post("/notification",response_model=NotificationsResponse)
async def create_notification(notification_data: NotificationsCreate):
    """
    Create a new notification and add it to the database.
    notification_data: NotificationCreate - The data for the new notification.
    Returns: A success message indicating the notification was created.
    """
    return NotificationsResponse(
        id = 1, #placeholder
        title = notification_data.title,
        message = notification_data.message,
        created_at = notification_data.created_at
    )
@router.get("/notification",response_model=list[NotificationsResponse])
async def get_notifications():
    """
    Return a list of all current notifications in the database.
    Returns: A list of notifications.
    """
    return [
        NotificationsResponse(
            id=1,  # Placeholder ID
            title="Notification1",
            message="Message1",
            created_at="2025-01-01T12:00:00"
        ),
        NotificationsResponse(
            id=2,  # Placeholder ID
            title="Notification2",
            message="Message2",
            created_at="2024-10-02T12:00:00"
        )
    ]

@router.put("/notification/{notification_id}",response_model=NotificationsResponse)
async def update_notification(notification_id: int, notification_data: NotificationsCreate):
    """
    Update a single notification's information in the database.
    notification_id: int - The ID of the notification to update.
    notification_data: NotificationCreate - The updated data for the notification.
    Returns: A success message indicating the notification was updated.
    """
    return NotificationsResponse(
        id=notification_id,
        title = notification_data.title,
        message = notification_data.message,
        created_at = notification_data.created_at
    )

@router.delete("/notification/{notification_id}",response_model=dict)
async def delete_notification(notification_id: int):
    """
    Delete a single notification from the database.
    notification_id: int - The ID of the notification to delete.
    Returns: A success message indicating the notification was deleted.
    """
    return {"message": f"Notification with ID {notification_id} deleted"}
