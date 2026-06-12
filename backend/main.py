5
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base

# Import all separate router files
from backend.routers import students_routes, results_routes, analytics_routes

app = FastAPI(title="Students performance analyzer Backend Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app.include_router(results_routes.router)
app.include_router(students_routes.router)
app.include_router(analytics_routes.router)



"""
get method frontend sachin vanne student first term result mage backend 
backend le k garne vo 
database vata mero roll ra class ko adarma mero row patta lagaraunxa like vanam 
mero row id number 7
teha backend subject marks haru extract garxa
division calculate each subject 
marks average nikalxa
average ko adarma feri overall division nikalne vo 

return 
each student ko division, overall division, average marks ,
attendance, name, roll number class 

post/ student ko detail halinxa 
get / 
student ko id vata student ko overall result pathinxa ->transcript tyo chahi yo
student ko id ko adarma ra term ko adarma result return ->
perfomace ko adarma  perfomance student ko marks return 
delete by id
login- then tyo manxe ko chat puran tyo sikna """