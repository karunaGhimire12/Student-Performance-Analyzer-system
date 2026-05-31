
import uvicorn
from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env file safely
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

HOST = os.getenv("host", "127.0.0.1")
PORT = int(os.getenv("port", 8000))

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",   # Ensure backend/main.py has an 'app = FastAPI()' instance
        host=HOST,
        port=PORT,
        reload=True,         
        log_level="info"
    )