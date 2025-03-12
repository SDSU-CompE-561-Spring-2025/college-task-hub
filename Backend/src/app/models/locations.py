from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime

class Locations(Base):
    '''
    ORM model for the locations table
    '''
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    street = Column(String, index=True, nullable=False)
    city = Column(String, index=True, nullable=False)
    state = Column(String, index=True, nullable=False)
    zipcode = Column(Integer, index=True, nullable=False)
