from sqlalchemy import Column, Integer, String, Text, ForeignKey, Table, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Association table for many-to-many relationship between User and Recipe
favourites = Table(
    "favourites",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("recipe_id", Integer, ForeignKey("recipes.id"), primary_key=True),
    UniqueConstraint("user_id", "recipe_id", name="unique_user_recipe")
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    recipes = relationship("Recipe", back_populates="user")
    favourites = relationship("Recipe", secondary=favourites, back_populates="users_who_favourited")

    def verify_password(self, password: str):
        return pwd_context.verify(password, self.hashed_password)
    
    @staticmethod
    def get_password_hash(password: str):
        return pwd_context.hash(password)

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    cuisine_type = Column(String)
    cooking_time = Column(Integer)
    ingredients = Column(Text)
    instructions = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="recipes")
    users_who_favourited = relationship("User", secondary=favourites, back_populates="favourites")