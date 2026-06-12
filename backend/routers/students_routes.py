
# backend/routers/student_routes.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.database import crud


# =====================================================
# ROUTER CONFIGURATION
# =====================================================
router = APIRouter(
    prefix="/students",
    tags=["Student Profiles"]
)


# =====================================================
# GET STUDENT PROFILE BY STUDENT_ID
# =====================================================
@router.get(
    "/{student_id}",
    summary="Get Student Profile"
)
def get_student_profile(
    student_id: int,
    db: Session = Depends(get_db)
):

    student = crud.get_student_by_id(
        db=db,
        student_id=student_id
    )

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {student_id} not found"
        )

    return student


# =====================================================
# DELETE STUDENT PROFILE
# =====================================================
@router.delete(
    "/{student_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Student Profile"
)
def delete_student_profile(
    student_id: int,
    db: Session = Depends(get_db)
):

    deleted_student = crud.delete_student(
        db=db,
        student_id=student_id
    )

    if deleted_student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {student_id} not found"
        )

    return {
        "status": "success",
        "message": f"Student {student_id} deleted successfully"
    }