# #CREATE FASTAPI APP

# from fastapi import FastAPI

# from backend.database.connection import engine
# from backend.database.models import Base

# # import routers
# from backend.routers import students, results


# Base.metadata.create_all(bind=engine)

# app = FastAPI()

# # include API routers under /api
# app.include_router(students.router, prefix="/api")
# app.include_router(results.router, prefix="/api")


# @app.get("/")
# def home():
#     return {"message": "Student Performance Analyzer API"}
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import students, results  # Import both router files

app = FastAPI(title="Student Performance Analyzer Backend")

# Allow Streamlit to communicate with FastAPI without CORS blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REGISTER ROUTERS EXPLICITLY
# If you don't declare prefixes here, they use the ones defined inside the router files
app.include_router(students.router)
app.include_router(results.router)

@app.get("/")
def root():
    return {"message": "API Engine Online"}