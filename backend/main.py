#CREATE FASTAPI APP

from fastapi import FastAPI

from backend.database.connection import engine
from backend.database.models import Base

# import routers
from backend.routers import students, results


Base.metadata.create_all(bind=engine)

app = FastAPI()

# include API routers under /api
app.include_router(students.router, prefix="/api")
app.include_router(results.router, prefix="/api")


@app.get("/")
def home():
    return {"message": "Student Performance Analyzer API"}