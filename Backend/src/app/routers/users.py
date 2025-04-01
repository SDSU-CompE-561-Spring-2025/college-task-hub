from fastapi import APIRouter
from app.schema.users import UsersCreate, UsersResponse

router = APIRouter()

# This is used as a placeholder until schema models are implemented
    
@router.post("/user", response_model=UsersResponse)
async def create_user(user_data: UsersCreate):
    """"
    Create a new user and add it to the database.
    user_data: UserCreate - The data for the new user.
    Returns: A success message indicating the user was created.
    """
    return UsersResponse(
        id=1, # Placeholder ID 
        name=user_data.name,
        email=user_data.email,
        skills=user_data.skills,
        roles=user_data.roles,
        rating=user_data.rating,
        phone_number=user_data.phone_number
    )


@router.get("/user",response_model=list[UsersResponse])
async def get_users():
    """"
    Return a list of all current users in the database.
    Returns: A list of users.
    """
    return [
        UsersResponse(
            id=1, # Placeholder ID 
            name="User1",
            email="User1@gmail.com",
            skills="schema",
            roles="student",
            rating=5,
            phone_number="123-456-7890"
        ),
        UsersResponse(
            id=2, # Placeholder ID
            name="User2",
            email="User2@gmail.com",
            skills="schema",
            roles="client",
            rating=5,
            phone_number="321-654-0987"
        )
    ]

@router.put("/user/{user_id}",response_model=UsersResponse)
async def update_user(user_id: int, user_data: UsersCreate):
    """"
    Update a single user's information in the database.
    user_id: int - The ID of the user to update.
    user_data: UserCreate - The updated data for the user.
    Returns: A success message indicating the user was updated.
    """
    return UsersResponse(
        id=user_id,
        name=user_data.name,
        email=user_data.email,
        skills=user_data.skills,
        roles=user_data.roles,
        rating=user_data.rating,
        phone_number=user_data.phone_number
    )

@router.delete("/user/{user_id}",response_model=dict)
async def delete_user(user_id: int):
    """"
    Delete a single user from the database.
    user_id: int - The ID of the user to delete.
    Returns: A success message indicating the user was deleted.
    """
    return {"message": f"User with ID {user_id} deleted"}
