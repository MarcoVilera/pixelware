import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/pixelware_payment")
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    PORT = os.getenv("PORT", 3004)