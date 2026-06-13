from sqlalchemy.orm import Session
from backend.database import models


#Individual student calculations
def calculate_average_and_division(english:int,nepali:int,mathematics:int,science:int,social:int):
    """
    Calculates the average percentage for a single student 
    and determines their division tier.
    """
    total_marks=english+nepali+mathematics+science+social
    average=total_marks/5.0
    if average>=90:
        division="A+"
    if average>=80:
        division="A"
    if average>=70:
        division="B+"
    if average>=60:
        division="B"
    if average>=50:
        division="C+"
    if average>=40:
        division="C"
    if average>=35:
        division="D"
    else:
        division="D"
    return average,division

def get_top_students(db:Session,limit:int=5):
    """Fetches studentas sorting from highest average (A+/A) down to lowest """
    return db.query(models.Result).order_by (models.Result.average.desc().limit(limit).all())


def get_strugling_students(db:Session,limit:int=5):
    return db.query(models.Result).filter (models.Result.averge<40.0)\
                .order_by(models.Result.average.asc()).all()


def get_average_students(db:Session):
    """
    Fetches mid-tier students whose scores match C+ up to A grades 
    (Between 40% and 80%).
    """
    return db.query(models.Result)\
             .filter(models.Result.average >= 40.0)\
             .filter(models.Result.average< 80.0)\
             .all()

def get_student_history(db: Session, student_id: int):
    """
    Fetches all performance records for a single student ID
    ordered by year and term to track their growth.
    """
    return (
        db.query(models.Result)
        .filter(models.Result.student_id == student_id)
        .order_by(models.Result.year.asc(), models.Result.term.asc())
        .all()
    )

