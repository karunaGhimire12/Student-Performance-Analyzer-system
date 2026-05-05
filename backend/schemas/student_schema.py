#CREATE SCHEMAS 
from pydantic import BaseModel


class StudentCreate(BaseModel):

    name: str
    student_class: str
    roll: int


class StudentResponse(StudentCreate):

    id: int

    class Config:
        from_attributes = True