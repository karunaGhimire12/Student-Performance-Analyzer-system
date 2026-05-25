from backend.database.models import Student, Result  
from sqlalchemy.orm import Session

def create_spreadsheet_results(db: Session, spreadsheet_data):
    """
    This function takes the combined spreadsheet rows,
    separates them, and saves them to the correct tables.
    """
    for row in spreadsheet_data:
        # Step 1: Handle the Student Identity Table
        # Check if the student already exists so we don't duplicate them
        existing_student = db.query(Student).filter(
            Student.roll == row.roll,
            Student.student_class == row.student_class
        ).first()

        if existing_student:
            student_id = existing_student.id
        else:
            # If they don't exist, insert into the 'students' table using correct columns
            new_student = Student(
                name=row.name,                  # Maps to Student.name
                student_class=row.student_class,# Maps to Student.student_class
                roll=row.roll            
            )
            db.add(new_student)
            db.flush()  # Generates the new student id safely
            student_id = new_student.id

        # Step 2: Handle the Exam Results Table
        # Insert the scores into the 'results' table linked via the student_id
        new_result = Result(
            student_id=student_id,             # Links back to our student
            term=row.term,
            year=row.year,
            english=row.english,
            nepali=row.nepali,
            mathematics=row.mathematics,
            science=row.science,
            social=row.social,
            attendance=row.attendance
        )
        db.add(new_result)

    db.commit()
    return {"status": "success", "message": "Spreadsheet data split and saved perfectly!"}



def save_spreadsheet_bulk(db: Session, payload_rows):
    """
    Processes the raw spreadsheet layout rows from AG Grid.
    Checks if a student exists by Class and Roll, creates them if new,
    and then attaches their terminal exam scores.
    """
    records_processed = 0
    
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

        # 3. Save the score snapshot tied to their student ID
        new_result = Result(
            student_id=student.id,  # Links to our Student identity table via Foreign Key
            term=str(row.term).strip(),
            year=int(row.year),
            english=int(row.english),
            nepali=int(row.nepali),
            mathematics=int(row.mathematics),
            science=int(row.science),
            social=int(row.social),
            attendance=int(row.attendance)
        )
        db.add(new_result)
        records_processed += 1

    db.commit()
    return {"status": "success", "records_saved": records_processed}