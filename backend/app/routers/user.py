from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@router.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
@router.get("/life-expectancy")
def get_life_expectancy(country: str, gender: str):
    # Implement logic to fetch life expectancy based on country and gender
    # For now, let's return some mock data
    if country == "USA":
        if gender == "male":
            life_expectancy = 76
        else:
            life_expectancy = 81
    elif country == "Canada":
        if gender == "male":
            life_expectancy = 80
        else:
            life_expectancy = 84
    else:
        life_expectancy = 75  # Default value
    return {"lifeExpectancy": life_expectancy}
