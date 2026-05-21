#CREATE RESULT ROUTER
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from  backend.database.connection import SessionLocal
from  backend.database import crud

from  backend.schemas.result_schema import (
    ResultCreate,
    ResultResponse
)
router = APIRouter()

# DATABASE SESSION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# CREATE RESULT
@router.post("/results", response_model=ResultResponse)
def create_result(
    result: ResultCreate,
    db: Session = Depends(get_db)
):

    return crud.create_result(db, result)


# GET STUDENT RESULTS
@router.get("/students/{student_id}/results")
def get_student_results(
    student_id: int,
    db: Session = Depends(get_db)
):

    return crud.get_student_results(db, student_id)