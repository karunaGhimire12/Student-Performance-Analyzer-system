# create databse model

# from sqlalchemy import Column, Integer, String
# from backend.database.connection import Base


# class Student(Base):

#     __tablename__ = "students"

#     id = Column(Integer, primary_key=True, index=True)

#     name = Column(String, index=True)

#     student_class = Column(String)

#     roll = Column(Integer)

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from backend.database.connection import Base


# STUDENT TABLE
# =========================
class Student(Base):

    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, index=True)

    student_class = Column(String)

    roll = Column(Integer)

    # relationship
    results = relationship("Result", back_populates="student")

# RESULT TABLE
# =========================
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

    # relationship
    student = relationship("Student", back_populates="results")