from sqlalchemy import select
from sqlalchemy.orm import Session
from . import models, schemas
from app.models import Recipe, User, favourites
from fastapi import HTTPException, status
from app.auth import get_current_user
from fastapi import Depends


def get_recipes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Recipe).offset(skip).limit(limit).all()

def get_recipe(db: Session, recipe_id: int):
    return db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()

def get_user_recipes(db: Session, current_user: User):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return db.query(models.Recipe).filter(models.Recipe.user_id == current_user.id).all()

def create_recipe(db: Session, recipe: schemas.RecipeCreate, current_user: User):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    db_recipe = models.Recipe(**recipe.model_dump(), user_id=current_user.id)
    try: 
        db.add(db_recipe)
        db.commit()
        db.refresh(db_recipe)
        return db_recipe
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

def update_recipe(db: Session, recipe_id: int, recipe: schemas.RecipeCreate, current_user: User):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not db_recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    if db_recipe.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this recipe")
    for key, value in recipe.model_dump().items():
        setattr(db_recipe, key, value)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def delete_recipe(db: Session, recipe_id: int, current_user: User):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not db_recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    if db_recipe.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this recipe")
    db.delete(db_recipe)
    db.commit()
    return db_recipe

def get_users(db: Session, skip: int = 0, limit: int = 100):
    users = db.query(models.User).offset(skip).limit(limit).all()
    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No users found")
    return users

def get_user_by_email(db: Session, email: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    return user

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = models.User.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    user_data = schemas.UserResponse.model_validate(db_user).model_dump()

    user_data.pop("hashed_password", None)
    
    return user_data

def toggle_favorite(db: Session, recipe_id: int, user_id: int):
    """Toggle favorite (like/unlike) for a recipe"""
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    favorite = db.query(favourites).filter(
        favourites.c.user_id == user_id, 
        favourites.c.recipe_id == recipe_id
        ).first()
    
    if favorite:
        db.execute(
            favourites.delete().where(
                (favourites.c.user_id == user_id) & (favourites.c.recipe_id == recipe_id)
                )
                )  
        # Unlike
        action = "unliked"
    else:
        db.execute(
            favourites.insert().values(user_id=user_id, recipe_id=recipe_id))  
        # Like
        action = "liked"

    db.commit()
    return {"message": f"Recipe {action} successfully"}

def get_favorites(db: Session, user_id: int):
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    stmt = select(Recipe).join(favourites).where(favourites.c.user_id == user_id)
    favorite_recipes = db.execute(stmt).scalars().all()
    return favorite_recipes

def count_favorites(db: Session, recipe_id: int):
    stmt = select(favourites).where(favourites.c.recipe_id == recipe_id)
    return len(db.execute(stmt).scalars().all())
    
