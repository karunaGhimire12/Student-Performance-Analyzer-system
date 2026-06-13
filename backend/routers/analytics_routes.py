# backend/routers/analytics_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# Import our database connection session and our math calculation file
from backend.database import get_db 
from backend.services import analytics

# Initialize the router block instead of using 'app = FastAPI()'
router = APIRouter(
    prefix="/analytics",
    tags=["School Analytics Metrics Portal"]
)

# =========================================================================
# THE SEPARATE ANALYTICS WEB ROUTES
# =========================================================================

@router.get("/top-students")
def get_top_leaderboard(db: Session = Depends(get_db)):
    """Fetches the top 5 performing student rows."""
    return analytics.get_top_students(db)

@router.get("/weak-students")
def get_struggling_list(db: Session = Depends(get_db)):
    """Fetches ALL students scoring below C+ (50%)."""
    return analytics.get_struggling_students(db)

@router.get("/average-students")
def get_average_list(db: Session = Depends(get_db)):
    """Fetches students scoring in the mid-tier (50% - 80%)."""
    return analytics.get_average_students(db)

@router.get("/student-history/{student_id}")
def get_history(student_id: int, db: Session = Depends(get_db)):
    return analytics.get_student_history(db, student_id)
