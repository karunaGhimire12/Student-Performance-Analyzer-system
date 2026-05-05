#CREATE CRUD FILE 
from sqlalchemy.orm import Session

from backend.database.models import Student


# CREATE STUDENT
def create_student(db: Session, student):

    new_student = Student(
        name=student.name,
        student_class=student.student_class,
        roll=student.roll
    )

    db.add(new_student)

    db.commit()

    db.refresh(new_student)

    return new_student


# GET ALL STUDENTS
def get_students(db: Session):

    return db.query(Student).all()


# GET SINGLE STUDENT
def get_student(db: Session, student_id: int):

    return db.query(Student).filter(
        Student.id == student_id
    ).first()


# DELETE STUDENT
def delete_student(db: Session, student_id: int):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if student:

        db.delete(student)

        db.commit()

    return student