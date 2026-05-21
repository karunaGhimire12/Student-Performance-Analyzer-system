from pydantic import BaseModel

class ResultCreate(BaseModel):

    student_id: int

    term: str

    year: int

    english: int

    nepali: int

    mathematics: int

    science: int

    social: int

    attendance: int


class ResultResponse(ResultCreate):

    id: int

    class Config:
        from_attributes = True