from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.connection import engine, Base

# Import all separate router files
from backend.routers import students_routes, results_routes, analytics_routes

app = FastAPI(title="EduMetrics Pro Backend Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables automatically
Base.metadata.create_all(bind=engine)

# Plug in the separate modules cleanly
app.include_router(students_routes.router)
app.include_router(results_routes.router)
app.include_router(analytics_routes.router)

@app.get("/")
def read_root():
    return {"status": "Online", "message": "Server running smoothly."}