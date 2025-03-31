from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# This is used as a placeholder until schema models are implemented
class LocationCreate(BaseModel):
    street: str
    city: str

@router.post("/location")
async def create_location(location_data: LocationCreate):
    """"
    Create a new location and add it to the database.
    location_data: LocationCreate - The data for the new location.
    Returns: A success message indicating the location was created.
    """
    return {"message": "Location created", "Info": location_data}

@router.get("/location")
async def get_locations():
    """"
    Return a list of all current locations in the database.
    Returns: A list of locations.
    """
    return {"message": "List of locations"}

@router.put("/location/{location_id}")
async def update_location(location_id: int, location_data: LocationCreate):
    """"
    Update a single location's information in the database.
    location_id: int - The ID of the location to update.
    location_data: LocationCreate - The updated data for the location.
    Returns: A success message indicating the location was updated.
    """
    return {"message": f"Location with ID {location_id} updated", "data": location_data}

@router.delete("/location/{location_id}")
async def delete_location(location_id: int):
    """"
    Delete a single location from the database.
    location_id: int - The ID of the location to delete.
    Returns: A success message indicating the location was deleted.
    """
    return {"message": f"Location with ID {location_id} deleted"}
