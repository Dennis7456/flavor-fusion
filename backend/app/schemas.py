from pydantic import BaseModel, EmailStr
from typing import Optional

class RecipeCreate(BaseModel):
    title: str
    cuisine_type: str
    cooking_time: int
    ingredients: str
    instructions: str

class Recipe(RecipeCreate):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class RecipeOut(BaseModel):
    id: int
    title: str
    cuisine_type: str
    cooking_time: int
    ingredients: str
    instructions: str

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
        
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserCreate):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    id: int
    email: EmailStr
    username: str

    class Config:
        from_attributes = True

class FavouriteCreate(BaseModel):
    user_id: int
    recipe_id: int

class Favourite(FavouriteCreate):
    id: int

    class Config:
        orm_mode = True

class FavouriteOut(BaseModel):
    message: str

class FavouriteCount(BaseModel):
    count: int

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserBase

class TokenData(BaseModel):
    email: Optional[str] = None