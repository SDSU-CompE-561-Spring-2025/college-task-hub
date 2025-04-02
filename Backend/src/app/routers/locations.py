from fastapi import APIRouter
from app.schema.locations import LocationsCreate, LocationsResponse

router = APIRouter()

@router.post("/location",response_model=LocationsResponse)
async def create_location(location_data: LocationsCreate):
    """"
    Create a new location and add it to the database.
    location_data: LocationCreate - The data for the new location.
    Returns: A success message indicating the location was created.
    """
    return LocationsResponse(
        id = 1,  # Placeholder 
        street = location_data.street,
        city = location_data.city,
        state = location_data.state,
        zipcode = location_data.zipcode
    )

@router.get("/location",response_model=list[LocationsResponse])
async def get_locations():
    """"
    Return a list of all current locations in the database.
    Returns: A list of locations.
    """
    return [
        LocationsResponse(
            id=1,  # Placeholder ID
            street="39177 College Ave",
            city="San Diego",
            state="CA",
            zipcode= 92115
        ),
        LocationsResponse(
            id=2,  # Placeholder ID
            street="1230 Montezuma Rd",
            city="San Diego",
            state="CA",
            zipcode= 12345
        )
    ]
    

@router.put("/location/{location_id}",response_model=LocationsResponse)
async def update_location(location_id: int, location_data: LocationsCreate):
    """"
    Update a single location's information in the database.
    location_id: int - The ID of the location to update.
    location_data: LocationCreate - The updated data for the location.
    Returns: A success message indicating the location was updated.
    """
    return LocationsResponse(
        id = location_id,
        street=location_data.street,
        city=location_data.city,
        state=location_data.state,
        zipcode=location_data.zipcode
    )

@router.delete("/location/{location_id}",response_model=dict)
async def delete_location(location_id: int):
    """"
    Delete a single location from the database.
    location_id: int - The ID of the location to delete.
    Returns: A success message indicating the location was deleted.
    """
    return {"message": f"Location with ID {location_id} deleted"}
