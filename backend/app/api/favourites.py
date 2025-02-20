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

router = APIRouter()

@router.get("/favourites/", response_model=List[schemas.Recipe])
def get_user_favourites(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        recipes = crud.get_favorites(db, user.id)
        return recipes
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))