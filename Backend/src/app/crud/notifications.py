# crud/notifications.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.notifications import Notifications
from app.schema.notifications import NotificationsCreate


# (Create) Create new notification in the database
def create_notification(db: Session, notification_data: NotificationsCreate):
    db_notification = Notifications(**notification_data.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

# This function takes a NotificationsCreate object, creates a new Notifications object, adds it to the session, commits the session, and returns the created notification
def get_notifications(db: Session):
    return db.query(Notifications).all()

# (Read) Get all notifications from the database
def get_notification(db: Session, notification_id: int):
    notification = db.query(Notifications).filter(Notifications.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

# (Read) Get a single notification by ID from the database
def update_notification(db: Session, notification_id: int, notification_data: NotificationsCreate):
    notification = get_notification(db, notification_id)
    for field, value in notification_data.dict().items():
        setattr(notification, field, value)
    db.commit()
    db.refresh(notification)
    return notification

# (Delete) Delete a notification from the database
def delete_notification(db: Session, notification_id: int):
    notification = get_notification(db, notification_id)
    db.delete(notification)
    db.commit()
    return {"message": f"Notification with ID {notification_id} deleted"}
