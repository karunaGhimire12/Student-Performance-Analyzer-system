from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database.connection import SessionLocal
from backend.database import crud
from backend.schemas.result_schema import SpreadsheetRow

router = APIRouter(prefix="/results", tags=["Exam Marks Manager"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🚀 The bulk route belongs right here under the /results prefix!
@router.post("/bulk")
def create_bulk_results(payload: List[SpreadsheetRow], db: Session = Depends(get_db)):
    try:
        # We hand the processing over to crud.py safely
        return crud.save_spreadsheet_bulk(db, payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk process failure: {str(e)}")