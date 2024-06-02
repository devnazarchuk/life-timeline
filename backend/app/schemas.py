# schemas.py
from pydantic import BaseModel
from datetime import date

class UserBase(BaseModel):
    name: str
    birthdate: date
    gender: str
    country: str
    happiness_level: int

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        orm_mode = True
