from fastapi import FastAPI, Depends
from .database import SessionLocal, engine
from . import models
from .api import recipes, auth, favourites

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(recipes.router,prefix="/api")
app.include_router(favourites.router,prefix="/api")
app.include_router(auth.router,prefix="/api")

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