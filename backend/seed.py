from app.database import SessionLocal, engine
from app.models import Base, User, Recipe, favourites
import random
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create a new session
db = SessionLocal()

try:
    # Drop all tables and recreate them
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # Create fake users
    users = [
        User(username="user1", email="user1@example.com", hashed_password=pwd_context.hash("password1")),
        User(username="user2", email="user2@example.com", hashed_password=pwd_context.hash("password2")),
    ]

    db.add_all(users)
    db.commit()  # Commit to ensure users have IDs

    # Refresh users to get their IDs
    for user in users:
        db.refresh(user)

    # Create fake recipes
    recipes = [
        Recipe(
            title=f"Recipe {i}",
            cuisine_type=random.choice(["italian", "mexican", "chinese", "japanese", "indian"]),
            cooking_time=random.randint(10, 120),
            ingredients="ingredient1, ingredient2, ingredient3",
            instructions="Cook it!",
            user_id=random.choice([user.id for user in users]),
        )
        for i in range(10)
    ]

    db.add_all(recipes)
    db.commit()  # Commit to ensure recipes have IDs

    # Refresh recipes to get their IDs
    for recipe in recipes:
        db.refresh(recipe)

    # Add some favourites
    for user in users:
        favourite_recipes = random.sample(recipes, 3)
        for recipe in favourite_recipes:
            stmt = favourites.insert().values(user_id=user.id, recipe_id=recipe.id)
            db.execute(stmt)

    db.commit()

    print("Database seeded successfully")

except Exception as e:
    db.rollback()
    print("Error seeding database:", e)

finally:
    db.close()
