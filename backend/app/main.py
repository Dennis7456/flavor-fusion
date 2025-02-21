from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from .database import SessionLocal, engine
from . import models
from .api import recipes, auth, favourites
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Allow requests from this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(recipes.router, prefix="/api")
app.include_router(favourites.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Flavour Fusion API"}