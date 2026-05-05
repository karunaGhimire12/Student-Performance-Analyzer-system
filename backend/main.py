#CREATE FASTAPI APP

from fastapi import FastAPI

from backend.database.connection import engine
from backend.database.models import Base


Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def home():

    return {"message": "Student Performance Analyzer API"}