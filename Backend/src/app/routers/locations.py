from app.schema.locations import LocationsCreate, LocationsResponse
from app.crud import locations as crud_locations
from app.dependencies import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.logger import logger


router = APIRouter()

@router.post("/location",response_model=LocationsResponse)
async def create_location(location_data: LocationsCreate, db: Session = Depends(get_db)):
    """"
    Create a new location and add it to the database.
    location_data: LocationCreate - The data for the new location.
    Returns: A success message indicating the location was created.
    """
    logger.info('Adding new location')
    return crud_locations.create_location(db=db, location=location_data)
   
@router.get("/location",response_model=list[LocationsResponse])
async def get_locations(db: Session = Depends(get_db)): 
    """"
    Return a list of all current locations in the database.
    Returns: A list of locations.
    """
    logger.info('Requesting location')
    return crud_locations.get_locations(db=db)
    
@router.put("/location/{location_id}",response_model=LocationsResponse)
async def update_location(location_id: int, location_data: LocationsCreate,db: Session = Depends(get_db)):
    """"
    Update a single location's information in the database.
    location_id: int - The ID of the location to update.
    location_data: LocationCreate - The updated data for the location.
    Returns: A success message indicating the location was updated.
    """
    logger.info('Updating location')
    return crud_locations.update_location(db=db, location_id=location_id, location_data=location_data)
   
@router.delete("/location/{location_id}",response_model=dict)
async def delete_location(location_id: int, db: Session = Depends(get_db)):
    """"
    Delete a single location from the database.
    location_id: int - The ID of the location to delete.
    Returns: A success message indicating the location was deleted.
    """
    logger.info('Deleting location')
    return crud_locations.delete_location(db=db, location_id=location_id)
