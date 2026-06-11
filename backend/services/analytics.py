# services/analytics.py
from sqlalchemy.orm import Session
from backend.database import Result, Student
from backend.utils import calculate_result_analysis
# =====================================================
# STUDENT HISTORY
# =====================================================

def get_student_history(db: Session, student_id: int):

    results = (
        db.query(Result)
        .filter(Result.student_id == student_id)
        .order_by(Result.year.asc(), Result.term.asc())
        .all()
    )

    response = []

    for result in results:

        analysis = calculate_result_analysis(
            result.english,
            result.nepali,
            result.mathematics,
            result.science,
            result.social
        )

        response.append({
            "id": result.result_id,
            "year": result.year,
            "term": result.term,

            "english": result.english,
            "nepali": result.nepali,
            "mathematics": result.mathematics,
            "science": result.science,
            "social": result.social,

            "average": analysis["average"],
            "division": analysis["division"],
            "category": analysis["category"]
        })

    return response
def _get_students_by_categories(
    db: Session,
    year:int,
    term:str,
    student_class: str,
    allowed_categories: list
):
    students = []

    results = (
        db.query(Result)
        .join(Student)
        .filter(Result.year==year,
                Result.term==term.strip(),
                Student.student_class == student_class.strip()
                )
              .order_by(Result.average.desc(),
                        )
              .all()
    )

    for result in results:

        analysis =calculate_result_analysis(result.english,
            result.nepali,
            result.mathematics,
            result.science,
            result.social)

        if analysis["category"] in allowed_categories:

            students.append({
                "student_id": result.student.student_id,
                "name": result.student.name,
                "student_class": result.student.student_class,
                "term": result.term,
                "year": result.year,
                "average": result.average,
                "division": analysis["division"],
                "category": analysis["category"]
            })

    return students



""" Excellent          -> Top Performance
Good + Average         -> Average Performance
Weak + Struggling      -> Weak Performance """


# =====================================================
# TOP PERFORMANCE STUDENTS
# Excellent
# =====================================================

def get_top_performance_students(
    db: Session,
    year:int,
    term:str,
    student_class: str
):

    return _get_students_by_categories(
        db,
        year,
        term,
        student_class,
        ["Excellent"]
    )


# =====================================================
# AVERAGE PERFORMANCE STUDENTS
# Good + Average
# =====================================================

def get_average_performance_students(
    db: Session,
    year:int,
    term:str,
    student_class: str
):

    return _get_students_by_categories(
        db,
        year,
        term,
        student_class,
        ["Good", "Average"]
    )


# =====================================================
# WEAK PERFORMANCE STUDENTS
# Weak + Struggling
# =====================================================

def get_weak_performance_students(
    db: Session,
    year,
    term,
    student_class: str

):

    return _get_students_by_categories(
        db,
        year,
        term,
        student_class,
        ["Weak", "Struggling"]
    )