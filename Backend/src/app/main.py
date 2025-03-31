from fastapi import FastAPI
from app.core.database import Base, engine
from app.routers import users, locations, tasks, notifications, ratings

Base.metadata.create_all(bind=engine) # Create tables

app = FastAPI() # Create app

# Include routers
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(locations.router, prefix="/api", tags=["locations"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(notifications.router, prefix="/api", tags=["notifications"])
app.include_router(ratings.router, prefix="/api", tags=["ratings"])

@app.get("/")
def root():
    return {"Hello:World"}
