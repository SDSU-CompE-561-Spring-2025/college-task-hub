from fastapi import FastAPI
from app.core.database import Base, engine
from app.routers import users, locations, tasks, notifications, ratings
from fastapi.middleware.cors import CORSMiddleware
from app.middleware.logger import logger
from app.middleware.logging_middleware import LoggingMiddleware

Base.metadata.create_all(bind=engine) # Create tables

app = FastAPI() # Create app
app.add_middleware(LoggingMiddleware) # Add our logging middleware

logger.info('Starting API server...')

# Configure CORS
origins = [
    "http://localhost:3000",  # Development frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],   # Allow all HTTPS methods
    allow_headers=["*"], # Allow all headers
)

# Include routers
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(locations.router, prefix="/api", tags=["locations"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(notifications.router, prefix="/api", tags=["notifications"])
app.include_router(ratings.router, prefix="/api", tags=["ratings"])

@app.get("/")
def root():
    return {"Hello:World"}
