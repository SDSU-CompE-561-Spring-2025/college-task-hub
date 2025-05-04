# crud/users.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.users import Users
from app.schema.users import UsersCreate
from app.core.security import verify_password
from app.core.auth import get_password_hash


# (Create) Create new user in the database
def create_user(db: Session, user_data: UsersCreate):
    hashed_pass = get_password_hash(user_data.password)
    
    db_user = Users(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_pass, 
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {
        "id": db_user.id,
        "name": db_user.name,
        "email": db_user.email,
    }

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

# (Read) Get all users from the database
def get_user(db: Session, user_id: int):
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_users(db: Session):
    return db.query(Users).all()

# (Update) Update a user in the database
def update_user(db: Session, user_id: int, user_data: UsersCreate):
    user = get_user(db, user_id)
    for field, value in user_data.dict().items():
        if field == "password":
            setattr(user, "password_hash", value)
        else:
            setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user

# (Delete) Delete a user from the database
def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    db.delete(user)
    db.commit()
    return {"message": f"User with ID {user_id} deleted"}

def get_user_by_username(db: Session, username: str):
    return db.query(Users).filter(Users.name == username).first()
