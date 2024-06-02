# models.py
from sqlalchemy import Column, Integer, String, Date
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    birthdate = Column(Date)
    gender = Column(String)
    country = Column(String)
    happiness_level = Column(Integer)
