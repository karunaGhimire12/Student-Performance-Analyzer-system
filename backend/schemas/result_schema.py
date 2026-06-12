#backend/schemas/result_schema.py
from pydantic import BaseModel
# ==========================================
# INPUT (Frontend → Backend)
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


# ==========================================
# OUTPUT (Backend → Frontend)
# ==========================================
class ResultResponse(BaseModel):
    result_id: int
    student_id:int
    term: str
    year: int
    english: int
    nepali: int
    mathematics: int
    science: int
    social: int
    attendance: int

    #THESE  CALCULATION COME FROM BACKEND ANALYTICS
    average: float
    division: str
    category: str

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
    average: Optional[float] = None
    division: Optional[str] = None """