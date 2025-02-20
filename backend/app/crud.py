from sqlalchemy import select
from sqlalchemy.orm import Session
from . import models, schemas
from app.models import Recipe, User, favourites
from fastapi import HTTPException, status


def get_recipes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Recipe).offset(skip).limit(limit).all()

def create_recipe(db: Session, recipe: schemas.RecipeCreate, user_id: int):
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    db_recipe = models.Recipe(**recipe.dict(), owner_id=user_id)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def update_recipe(db: Session, recipe_id: int, recipe: schemas.RecipeCreate, user_id: int):
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not db_recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    if db_recipe.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this recipe")
    db_recipe.title = recipe.title
    db_recipe.cuisine_type = recipe.cuisine_type
    db_recipe.cooking_time = recipe.cooking_time
    db_recipe.ingredients = recipe.ingredients
    db_recipe.instructions = recipe.instructions
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def delete_recipe(db: Session, recipe_id: int, user_id: int):
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not db_recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    if db_recipe.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this recipe")
    db.delete(db_recipe)
    db.commit()
    return db_recipe

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = models.user.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def favorite_recipe(db: Session, user_id: int, recipe_id: int):
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    db_favorite = models.Favorite(user_id=user_id, recipe_id=recipe_id)
    db.add(db_favorite)
    db.commit()
    return db_favorite

def get_favorites(db: Session, user_id: int):
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    stmt = select(Recipe).join(favourites).where(favourites.c.user_id == user_id)
    favorite_recipes = db.execute(stmt).scalars().all()

    return favorite_recipes
    
