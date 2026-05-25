from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database.connection import SessionLocal
from backend.database import crud
from backend.schemas.student_schema import StudentResponse

router = APIRouter(prefix="/students", tags=["Student Core Profiles"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Standard route to view all registered students
@router.get("", response_model=List[StudentResponse])
def read_all_students(db: Session = Depends(get_db)):
    return crud.get_students(db)

# Standard route to delete an individual student
@router.delete("/{student_id}")
def remove_student_profile(student_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_student(db, student_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Student record not found.")
    return {"status": "success", "message": "Profile removed successfully."}