from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from .. import schemas, crud, models
from ..database import get_db
from typing import List
from ..auth import get_current_user

router = APIRouter()

@router.post(
        "/recipes/", 
        summary="Create a new recipe",
        response_model=schemas.Recipe)
def create_recipe(
    recipe: schemas.RecipeCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    try:
        return crud.create_recipe(db, recipe, current_user)
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get(
        "/recipes/", 
        response_model=List[schemas.Recipe],
        summary="Get all recipes")
def read_recipes(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
    ):
    try:
        recipes = crud.get_recipes(db, skip=skip, limit=limit)
        return recipes
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get(
        "/recipes/{recipe_id}", 
        response_model=schemas.Recipe,
        summary="Get a recipe by ID"
        )
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    try:
        db_recipe = crud.get_recipe(db, recipe_id)
        if db_recipe is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
        return db_recipe
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put(
        "/recipes/{recipe_id}", 
        response_model=schemas.Recipe,
        summary="Update a recipe by ID")
def update_recipe(
    recipe_id: int, 
    recipe: schemas.RecipeCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    try:
        db_recipe = crud.update_recipe(db, recipe_id, recipe, current_user)
        if db_recipe is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
        return db_recipe
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete(
        "/recipes/{recipe_id}", 
        response_model=schemas.Recipe,
        summary="Delete a recipe by ID")
def delete_recipe(
    recipe_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    try:
        db_recipe = crud.delete_recipe(db, recipe_id, current_user)
        if db_recipe is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
        return db_recipe
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))