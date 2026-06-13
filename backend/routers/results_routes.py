from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db,Student,Result
from backend.database import crud
from backend.schemas  import SpreadsheetRow

router = APIRouter(prefix="/results", tags=["Exam Marks Manager"])


#  The bulk route belongs right here under the /results prefix!
@router.post("/bulk")
def create_bulk_results(payload: List[SpreadsheetRow], db: Session = Depends(get_db)):
    print(payload)
    try:
    
        # We hand the processing over to crud.py safely
        return crud.save_spreadsheet_bulk(db, payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk process failure: {str(e)}")