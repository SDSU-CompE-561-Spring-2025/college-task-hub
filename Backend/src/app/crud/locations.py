# crud/locations.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.locations import Locations
from app.schema.locations import LocationsCreate

# (Create) Create new loaction in the database
def create_location(db: Session, location: LocationsCreate):
    db_location = Locations(**location.dict())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

# (Read) Get all locations from the database
def get_locations(db: Session):
    return db.query(Locations).all()

# (Read) Get a single location by ID from the database
def get_location(db: Session, location_id: int):
    location = db.query(Locations).filter(Locations.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location

# (Update) Update a location in the database
# This function takes a location ID and a LocationsCreate object, updates the location in the database, and returns the updated location
def update_location(db: Session, location_id: int, location_data: LocationsCreate):
    location = get_location(db, location_id)
    for field, value in location_data.dict().items():
        setattr(location, field, value)
    db.commit()
    db.refresh(location)
    return location

# (Delete) Delete a location from the database
def delete_location(db: Session, location_id: int):
    location = get_location(db, location_id)
    db.delete(location)
    db.commit()
    return {"message": f"Location with ID {location_id} deleted"}
