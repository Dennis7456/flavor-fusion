import pytest
from fastapi.testclient import TestClient
from datetime import timedelta
from sqlalchemy.orm import Session

from app.main import app
from app.models import User
from app.auth import create_access_token, get_password_hash
from app.database import get_db


@pytest.fixture
def client():
    """Fixture to create a FastAPI TestClient."""
    return TestClient(app)


@pytest.fixture
def test_recipe():
    """Fixture providing test recipe data."""
    return {
        "title": "Test Recipe",
        "cuisine_type": "French",
        "cooking_time": 30,
        "ingredients": "test ingredient 1, test ingredient 2",
        "instructions": "Mix ingredients and cook",
    }


@pytest.fixture
def db_session():
    """Fixture to provide a database session."""
    db = next(get_db())  # Get DB session
    try:
        yield db
    finally:
        db.close()  # Ensure DB session is closed


@pytest.fixture
def test_user(db_session):
    """Fixture to create a test user in the database."""
    existing_user = db_session.query(User).filter(User.email == "testuser@example.com").first()
    
    if not existing_user:
        hashed_password = get_password_hash("password1")
        user = User(
            username="testuser",  
            email="testuser@example.com",
            hashed_password=hashed_password
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
    else:
        user = existing_user  # Fixes the 'UnboundLocalError'

    return user


@pytest.fixture
def auth_headers(test_user):
    """Fixture to generate authentication headers with a valid JWT token."""
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": test_user.email}, expires_delta=access_token_expires
    )
    print(f"Generated Token: Bearer {access_token}")  # Debugging line
    return {"Authorization": f"Bearer {access_token}"}

def test_toggle_favorite(client: TestClient, test_recipe, auth_headers):
    """Test adding and removing a recipe from favorites."""
    
    # Step 1: Create a test recipe
    create_response = client.post("/api/recipes/", json=test_recipe, headers=auth_headers)
    assert create_response.status_code == 200
    recipe_id = create_response.json()["id"]

    # Step 2: Toggle favorite (add)
    toggle_response = client.post(f"/api/recipes/{recipe_id}/favorite", headers=auth_headers)
    assert toggle_response.status_code == 200
    assert toggle_response.json()["message"] == "Recipe liked successfully"

    # Step 3: Toggle favorite again (remove)
    toggle_response = client.post(f"/api/recipes/{recipe_id}/favorite", headers=auth_headers)
    assert toggle_response.status_code == 200
    assert toggle_response.json()["message"] == "Recipe unliked successfully"


def test_get_favorites(client: TestClient, test_recipe, auth_headers):
    """Test retrieving a user's favorite recipes."""

    # Step 1: Create a test recipe
    create_response = client.post("/api/recipes/", json=test_recipe, headers=auth_headers)
    assert create_response.status_code == 200
    recipe_id = create_response.json()["id"]

    # Step 2: Add to favorites
    toggle_response = client.post(f"/api/recipes/{recipe_id}/favorite", headers=auth_headers)
    assert toggle_response.status_code == 200

    # Step 3: Retrieve favorites
    favorites_response = client.get("/api/users/favorites", headers=auth_headers)
    assert favorites_response.status_code == 200
    favorites = favorites_response.json()

    # Step 4: Validate response
    assert isinstance(favorites, list)
    assert any(recipe["id"] == recipe_id for recipe in favorites)


def test_get_favorite_count(client: TestClient, test_recipe, auth_headers):
    """Test retrieving the favorite count for a recipe."""

    # Step 1: Create a test recipe
    create_response = client.post("/api/recipes/", json=test_recipe, headers=auth_headers)
    assert create_response.status_code == 200
    recipe_id = create_response.json()["id"]

    # Step 2: Check initial favorite count
    count_response = client.get(f"/api/recipes/{recipe_id}/favorite-count")
    assert count_response.status_code == 200
    assert count_response.json()["count"] == 0  # Should be 0 initially

    # Step 3: Add recipe to favorites
    toggle_response = client.post(f"/api/recipes/{recipe_id}/favorite", headers=auth_headers)
    assert toggle_response.status_code == 200

    # Step 4: Check favorite count after adding
    count_response = client.get(f"/api/recipes/{recipe_id}/favorite-count")
    assert count_response.status_code == 200
    assert count_response.json()["count"] == 1  # Should now be 1
