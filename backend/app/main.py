from fastapi import FastAPI
from .routers import user
from .database import engine, Base

app = FastAPI()

app.include_router(user.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Life Calendar API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
