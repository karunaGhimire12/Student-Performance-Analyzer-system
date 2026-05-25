from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from backend.database.connection import Base


# ==========================================
# 1. STUDENT TABLE (Identity Data Only)
# ==========================================
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    student_class = Column(String)
    roll = Column(Integer)

    # Relationship to link back to their marks history
    # back_populates matches the property name inside the Result class
    results = relationship("Result", back_populates="student", cascade="all, delete-orphan")


# ==========================================
# 2. RESULT TABLE (Exam Performance Records)
# ==========================================
class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    
    term = Column(String)
    year = Column(Integer)
    english = Column(Integer)
    nepali = Column(Integer)
    mathematics = Column(Integer)
    science = Column(Integer)
    social = Column(Integer)
    attendance = Column(Integer)

    # Relationship to link back to the specific student record
    # back_populates matches the property name inside the Student class
    student = relationship("Student", back_populates="results")