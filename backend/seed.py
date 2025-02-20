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
    db.commit()

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
    db.commit()

    # Add some favourites
    for user in users:
        # Randomly select 3 recipes to favourite
        favourite_recipes = random.sample(recipes, 3)
        for recipe in favourite_recipes:
            user.favourites.append(recipe)

    db.commit()

    print("Database seeded successfully")

except Exception as e:
    db.rollback()
    print("Error seeding database:", e)

finally:
    db.close()