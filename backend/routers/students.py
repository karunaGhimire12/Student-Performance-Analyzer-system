#CREATE API ROUTE
"""This file creates API routes/endpoints using FastAPI and connects:
client requests
schemas
database
 CRUD operations"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import SessionLocal
from backend.database import crud
from backend.schemas.student_schema import (
    StudentCreate,
    StudentResponse
)


router = APIRouter()


# DATABASE SESSION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# CREATE STUDENT
@router.post("/students", response_model=StudentResponse)
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):

    return crud.create_student(db, student)


# GET ALL STUDENTS
@router.get("/students")
def get_students(db: Session = Depends(get_db)):

    return crud.get_students(db)


# GET SINGLE STUDENT
@router.get("/students/{student_id}")
def get_student(
    student_id: int,
    db: Session = Depends(get_db)
):

    return crud.get_student(db, student_id)


# DELETE STUDENT
@router.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db)
):

    return crud.delete_student(db, student_id)