
#backend/database/crud.py

from sqlalchemy.orm import Session
from backend.database import Student, Result
from backend.services import calculate_result_analysis

#========================================================
#GET STUDENT DETAILS BY STUDENT_ID
def get_student_by_id(db:Session,student_id:int):
    return(
        db.query(Student)
        .filter(Student.student_id==student_id)
        .first()
    )


# =====================================================
# GET STUDENTS RESULT BY STUDENT_ID+TERM+YEAR
# =====================================================
def get_student_result(db: Session,student_id:int,term:str,year:int):
    result=(db.query(Result)
        .filter(
            Result.student_id==student_id,
            Result.year==year,
            Result.term==term.strip()
            )
            .first()
    )

    if not result:
        return None
    
    analysis=calculate_result_analysis(
        result.english,
        result.nepali,
        result.mathematics,
        result.science,
        result.social
    )
    
    return {
        "result_id": result.result_id,
        "student_id": result.student_id,
        "term": result.term,
        "year": result.year,

        "english": result.english,
        "nepali": result.nepali,
        "mathematics": result.mathematics,
        "science": result.science,
        "social": result.social,
        "attendance": result.attendance,

        "average": result.average,
        "division": analysis["division"],
        "category": analysis["category"]
    }


# =====================================================
# DELETE STUDENT also deletes results automatically)
# because of cascade="all, delete-orphan"
# =====================================================
def delete_student(db: Session,student_id: int):

    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()

    if not student:
        return None
    db.delete(student)
    db.commit()
    return student


# ======================================================
"""
Save all details of multiple student or multiple result of
same student at a same time using this function"""
#Create/Update Students and Results
# =========================================================


def save_spreadsheet_bulk(db: Session, payload_rows):

    records_processed = 0

    for row in payload_rows:

        # -------------------------------------------------
        # 1. Skip empty or invalid rows 
        # -------------------------------------------------
        if not getattr(row, "name", "").strip():
            continue

        if int(row.roll) <= 0:
            continue

        # -------------------------------------------------
        # 2. Find existing student (Class + Roll)
        # -------------------------------------------------
        student = db.query(Student).filter(
            Student.roll == int(row.roll),
            Student.student_class == str(row.student_class)
        ).first()

        # -------------------------------------------------
        # 3. Create student if not exists
        # -------------------------------------------------
        if not student:
            student = Student(
                name=str(row.name).strip(),
                roll=int(row.roll),
                student_class=str(row.student_class)
            )
            db.add(student)
            db.flush()  # generate student_id before using it

        # -------------------------------------------------
        # 4. Update student name if changed
        # -------------------------------------------------
        elif student.name != str(row.name).strip():
            student.name = str(row.name).strip()

        # -------------------------------------------------
        # 5. Calculate average + division
        # -------------------------------------------------
        analysis=calculate_result_analysis(
            english=int(row.english),
            nepali=int(row.nepali),
            mathematics=int(row.mathematics),
            science=int(row.science),
            social=int(row.social)
        )
        avg=analysis["average"]
        division=analysis["division"]
        category=analysis["category"]


        # -------------------------------------------------
        # 6. Check if result already exists
        #    (prevents duplicate uploads for same term/year)
        # -------------------------------------------------
        existing_result = db.query(Result).filter(
            Result.student_id == student.student_id,
            Result.term == str(row.term).strip(),
            Result.year == int(row.year)
        ).first()

        # -------------------------------------------------
        # 7. UPDATE if exists
        # -------------------------------------------------
        if existing_result:

            existing_result.english = int(row.english)
            existing_result.nepali = int(row.nepali)
            existing_result.mathematics = int(row.mathematics)
            existing_result.science = int(row.science)
            existing_result.social = int(row.social)
            existing_result.attendance = int(row.attendance)

            existing_result.average = avg
            existing_result.division = division       # ✅ FIX
            existing_result.category = category   

        # -------------------------------------------------
        # 8. CREATE new result
        # -------------------------------------------------
        else:

            new_result = Result(
                student_id=student.student_id,
                term=str(row.term).strip(),
                year=int(row.year),

                english=int(row.english),
                nepali=int(row.nepali),
                mathematics=int(row.mathematics),
                science=int(row.science),
                social=int(row.social),
                attendance=int(row.attendance),
                average=avg,
                division=division,
                category=category

            )

            db.add(new_result)

        records_processed += 1

    # -------------------------------------------------
    # 9. Commit once (FAST & SAFE)
    # -------------------------------------------------
    db.commit()

    return {
        "status": "success",
        "records_saved": records_processed
    }

