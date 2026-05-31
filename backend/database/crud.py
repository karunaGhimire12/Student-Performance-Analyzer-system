from backend.database import Student, Result  
from sqlalchemy.orm import Session
from backend.services import analytics

"""  Processes the raw spreadsheet layout rows from AG Grid.
    Checks if a student exists by Class and Roll, creates them if new,
    and then attaches their terminal exam scores. """
def save_spreadsheet_bulk(db: Session, payload_rows):

    records_processed=0

    for row in payload_rows:
    # 1. Search if student exists by checking both Class AND Roll
        student = db.query(Student).filter(
        Student.roll == int(row.roll),
        Student.student_class == str(row.student_class)
    ).first()

    # 2. If student doesn't exist, create their identity profile first
    if not student:
        student = Student(
            name=str(row.name).strip(),
            roll=int(row.roll),
            student_class=str(row.student_class)
        )
        db.add(student)
        db.flush()  # Populates student.id safely before committing
    else:
        # If the student exists but their name spelling changed in the sheet, update it
        if row.name and student.name != row.name:
            student.name = str(row.name).strip()
    avg, div = analytics.calculate_average_and_division(
        english=int(row.english),
        nepali=int(row.nepali),
        mathematics=int(row.mathematics),
        science=int(row.science),
        social=int(row.social)
    )

    # 3. Save the score snapshot tied to their student ID
    new_result = Result(
        student_id=student.student_id,  # Links to our Student identity table via Foreign Key
        term=str(row.term).strip(),
        year=int(row.year),
        english=int(row.english),
        nepali=int(row.nepali),
        mathematics=int(row.mathematics),
        science=int(row.science),
        social=int(row.social),
        attendance=int(row.attendance),
        average=avg,
        division=div
    )
    db.add(new_result)
    records_processed += 1

    db.commit()
    return {"status": "success", "records_saved": records_processed}

