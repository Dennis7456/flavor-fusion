from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.database import get_db
from app.models import Recipe, User, favourites
from .. import schemas, crud, models
from app.schemas import RecipeOut
from typing import List
from app.auth import get_current_user
from typing import List

router = APIRouter()

@router.post("/recipes/{recipe_id}/favorite")
def toggle_favorite(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.toggle_favorite(db, recipe_id, current_user.id)

@router.get("/users/favorites", response_model=List[schemas.Recipe])
def get_favorites(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_favorites(db, current_user.id)

@router.get("/recipes/{recipe_id}/favorite-count")
def get_favorite_count(recipe_id: int, db: Session = Depends(get_db)):
    return {"count": crud.count_favorites(db, recipe_id)}