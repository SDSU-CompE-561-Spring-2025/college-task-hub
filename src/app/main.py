from fastapi import FastAPI

app = FastAPI() # Create app

@app.get("/") # Define root
def read_root():
    return {"Hello": "World"}
