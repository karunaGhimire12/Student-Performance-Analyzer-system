#backend/schemas/student_schema.py

from pydantic import BaseModel


# ==========================================
# CREATE STUDENT SCHEMA
# ==========================================
# This matches SQLAlchemy Student model exactly!

class StudentCreate(BaseModel):
    roll: int
    name: str
    student_class: str
   

# ==========================================
# RESPONSE SCHEMA
# ==========================================
class StudentResponse(StudentCreate):
    student_id: int
    
    class Config:
        from_attributes = True