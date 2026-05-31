from pydantic import BaseModel
from typing import Optional

# ==========================================
# STANDARD RESULT SCHEMAS
# ==========================================
class ResultCreate(BaseModel):
    student_id: int
    term: str
    year: int
    english: int
    nepali: int
    mathematics: int
    science: int
    social: int
    attendance: int

class ResultResponse(ResultCreate):
    id: int
    # ➕ ADD THESE: So FastAPI can include them in the JSON responses!
    average: float
    division: str

    class Config:
        from_attributes = True


# ==========================================
# SPREADSHEET ROW SCHEMA FOR BULK ROUTE
# ==========================================
class SpreadsheetRow(BaseModel):
    roll: int
    name: str
    student_class: str
    term: str
    year: int
    english: int
    nepali: int
    mathematics:int
    science:int
    social:int
    attendance:int

    """# ➕ ADD THESE: So your combined table layout can load them from the spreadsheet!
    average_mark: Optional[float] = None
    division: Optional[str] = None """