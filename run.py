
import uvicorn
from dotenv import load_dotenv
import os
from pathlib import Path
from backend.config import HOST,PORT

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",   
        log_level="info"
    )