from fastapi import FastAPI
from .routers import user
from .database import engine, Base

app = FastAPI()

app.include_router(user.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Life Calendar API"}
