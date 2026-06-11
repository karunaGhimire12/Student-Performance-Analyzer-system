#backend/database/models.Py
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    UniqueConstraint
)
from sqlalchemy.orm import relationship

from backend.database import Base


# =====================================================
# STUDENT TABLE
# Stores permanent student identity information
# =====================================================
class Student(Base):
    __tablename__ = "students"

    # Prevent duplicate students in same class
    # Example:
    # Class 10 Roll 1 -> allowed once only
    __table_args__ = (
        UniqueConstraint(
            "student_class",
            "roll",
            name="uq_class_roll"
        ),
    )

    # Primary Key
    student_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Student information
    name = Column(
        String,
        nullable=False,
        index=True
    )

    student_class = Column(
        String,
        nullable=False,
        index=True
    )

    roll = Column(
        Integer,
        nullable=False,
        index=True
    )

    # One student can have many exam results
    results = relationship(
        "Result",
        back_populates="student",
        cascade="all, delete-orphan"
    )


# =====================================================
# RESULT TABLE
# Stores exam performance records
# =====================================================
class Result(Base):
    __tablename__ = "results"


    __table_args__ = (
    UniqueConstraint(
        "student_id",
        "term",
        "year",
        name="uq_student_term_year"
    ),
)


    # Primary Key
    result_id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # Foreign Key -> Student table
    student_id = Column(
        Integer,
        ForeignKey("students.student_id"),
        nullable=False
    )

    # Exam details
    term = Column(
        String,
        nullable=False
    )

    year = Column(
        Integer,
        nullable=False
    )

    # Subject marks
    english = Column(
        Integer,
        nullable=False
    )

    nepali = Column(
        Integer,
        nullable=False
    )

    mathematics = Column(
        Integer,
        nullable=False
    )

    science = Column(
        Integer,
        nullable=False
    )

    social = Column(
        Integer,
        nullable=False
    )

    attendance = Column(
        Integer,
        nullable=False
    )

    # Calculated fields
    average = Column(
        Float,
        nullable=False
    )

    division = Column(
       String(20),
        nullable=False
     )
    category=Column(
        String(25),
        nullable=False)

    # Many Results -> One Student
    student = relationship(
        "Student",
        back_populates="results"
    )