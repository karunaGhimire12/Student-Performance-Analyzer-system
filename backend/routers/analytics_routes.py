# backend/routers/analytics_routes.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.services import analytics

router = APIRouter(
    prefix="/analytics",
    tags=["Student Report Cards and Analytics"]
)

# =====================================================
# TEACHER DASHBOARD ANALYTICS
# =====================================================

@router.get("/dashboard")
def get_dashboard(
    year: int,
    term: str,
    student_class: str = Query(...),
    db: Session = Depends(get_db)
):
    return analytics.get_dashboard_analytics(
        db,
        year,
        term,
        student_class
    )
# =====================================================
# STUDENT HISTORY
# =====================================================

@router.get("/student-history/{student_id}")
def get_student_history(
    student_id: int,
    db: Session = Depends(get_db)
):
    return analytics.get_student_history(
        db,
        student_id
    )


# =====================================================
# TOP PERFORMANCE STUDENTS
# =====================================================

@router.get("/top-performance-students")
def get_top_students(
    year: int,
    term: str,
    student_class: str = Query(...),
    db: Session = Depends(get_db)
):
    return analytics.get_top_performance_students(
        db,
        year,
        term,
        student_class
    )


# =====================================================
# AVERAGE PERFORMANCE STUDENTS
# =====================================================

@router.get("/average-performance-students")
def get_average_students(
    year: int,
    term: str,
    student_class: str = Query(...),
    db: Session = Depends(get_db)
):
    return analytics.get_average_performance_students(
        db,
        year,
        term,
        student_class
    )


# =====================================================
# WEAK PERFORMANCE STUDENTS
# =====================================================

@router.get("/weak-performance-students")
def get_weak_students(
    year: int,
    term: str,
    student_class: str = Query(...),
    db: Session = Depends(get_db)
):
    return analytics.get_weak_performance_students(
        db,
        year,
        term,
        student_class
    )