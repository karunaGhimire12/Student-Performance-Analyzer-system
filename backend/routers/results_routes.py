#backend/routes/result_routes.py
from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db,Student,Result
from backend.database import crud
from backend.schemas import SpreadsheetRow

router = APIRouter(prefix="/results", tags=["Exam Marks Manager"])


#  The bulk route belongs right here under the /results prefix!
@router.post("/bulk")
def create_bulk_results(payload: List[SpreadsheetRow], db: Session = Depends(get_db)):
    print(payload)
    try:
    
        # We hand the processing over to crud.py safely
        return crud.save_spreadsheet_bulk(db, payload)
    except Exception as e:
        raise HTTPException(status_code=500,
                             detail=f"Bulk process failure: {str(e)}")
    


@router.get("/{student_id}",summary="Get student by student_id,term and year"
            )
def get_student_result(
    student_id:int,
    year:int,
    term:str,
    db:Session =Depends(get_db)
):
    result=crud.get_student_result(
        db=db,
        student_id=student_id,
        term=term,
        year=year
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found"
        )
    return  result


@router.get("/term/{year}/{term}", summary="Get all students by year and term")

def get_results_by_term_year(
    year: int,
    term: str,
    db: Session = Depends(get_db)
):
    results = (
        db.query(Result)
        .filter(
            Result.year == year,
            Result.term == term
        )
        .all()
    )

    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No results found"
        )

    return results