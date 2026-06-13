#CREATE DATABASE CONNECTION 

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import declarative_base
from backend.config import DATABASE_URL


#Databse connection
#connect python with database
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)
#Interaction with databse
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
#It helpsto create database table
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()