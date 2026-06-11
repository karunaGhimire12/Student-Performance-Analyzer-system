#backend/utils/analytics_helper.py
# =====================================================
# CALCULATE AVERAGE, DIVISION AND CATEGORY
# =====================================================

def calculate_result_analysis(
    english: int,
    nepali: int,
    mathematics: int,
    science: int,
    social: int
):
    """
    Calculates:
    1. Average
    2. Division
    3. Category

    Category Rules:
    Excellent  > 90
    Good       80-90
    Average    60-80
    Weak       40-60
    Struggling < 40
    """

    total_marks = (
        english +
        nepali +
        mathematics +
        science +
        social
    )

    average = round(total_marks / 5.0, 2)

    # Division Arrays
    division_marks = [90, 80, 70, 60, 50, 40, 35, 0]
    divisions = ["A+", "A", "B+", "B", "C+", "C", "D", "NG"]

    # Category Arrays
    category_marks = [90, 80, 60, 40, 0]
    categories = [
        "Excellent",
        "Good",
        "Average",
        "Weak",
        "Struggling"
    ]

    division = "NG"
    category = "Struggling"

    # Find Division
    for mark, grade in zip(division_marks, divisions):
        if average >= mark:
            division = grade
            break

    # Find Category
    for mark, categories in zip(category_marks, categories):
        if average >= mark:
            category = categories
            break

    return {
        "average": average,
        "division": division,
        "category": category
    }
