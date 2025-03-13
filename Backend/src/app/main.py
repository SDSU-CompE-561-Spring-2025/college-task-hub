from fastapi import FastAPI
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine) # Create tables

app = FastAPI() # Create app

@app.get("/")
def read_root():
    return {"Hello": "World"}
