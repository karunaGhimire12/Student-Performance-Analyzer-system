#CREATE DATABASE MODELS 

from sqlalchemy import Column, Integer, String
from backend.database.connection import Base


class Student(Base):

    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, index=True)

    student_class = Column(String)

    roll = Column(Integer)