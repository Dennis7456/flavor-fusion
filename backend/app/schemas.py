from pydantic import BaseModel

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