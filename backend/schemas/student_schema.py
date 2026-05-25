from pydantic import BaseModel

# ==========================================
# CREATE STUDENT SCHEMA
# ==========================================
# This matches your SQLAlchemy Student model exactly!
class StudentCreate(BaseModel):
    name: str
    student_class: str
    roll: int


# ==========================================
# RESPONSE SCHEMA
# ==========================================
class StudentResponse(StudentCreate):
    id: int

    class Config:
        from_attributes = True