from pydantic import BaseModel

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

    class Config:
        from_attributes = True



# ADD THIS: SPREADSHEET ROW SCHEMA FOR BULK ROUTE

# This is what bridges the gap! It contains fields from BOTH 
# the Student table (name, roll, student_class) and the Result table.
class SpreadsheetRow(BaseModel):
    roll: int
    name: str
    student_class: str
    term: str
    year: int
    english: int
    nepali: int
    mathematics: int
    science: int
    social: int
    attendance: int