import pytest
from fastapi.testclient import TestClient
from datetime import timedelta
from sqlalchemy.orm import Session

from app.main import app
from app.models import User, Recipe
from app.schemas import RecipeCreate
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


def test_create_recipe(client: TestClient, test_recipe, auth_headers):
    """Test creating a recipe with authentication."""
    print(f"Auth Headers: {auth_headers}")  # Debugging line
    print(f"Sending JSON: {test_recipe}") # Debugging line

    response = client.post("/api/recipes/", json=test_recipe, headers=auth_headers)

    print(f"Response Status Code: {response.status_code}")  # Debugging line
    print(f"Response Content: {response.content}")  # Debugging line

    assert response.status_code == 200 
    data = response.json()
    assert data["title"] == test_recipe["title"]
    assert data["cuisine_type"] == test_recipe["cuisine_type"]
    assert data["cooking_time"] == test_recipe["cooking_time"]
    assert data["ingredients"] == test_recipe["ingredients"]
    assert data["instructions"] == test_recipe["instructions"]


def test_read_recipes(client: TestClient):
    response = client.get("/api/recipes/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_read_recipe_not_found(client: TestClient):
    response = client.get("/api/recipes/9999")  # Assuming ID 9999 does not exist
    assert response.status_code == 404
    assert response.json()["detail"] == "Recipe not found"


def test_update_recipe(client: TestClient, test_recipe, auth_headers):
    """Test updating a recipe."""
    # First, create a recipe
    create_response = client.post("/api/recipes/", json=test_recipe, headers=auth_headers)
    assert create_response.status_code == 200
    recipe_id = create_response.json()["id"]

    # Update the recipe
    updated_recipe = test_recipe.copy()
    updated_recipe["title"] = "Updated Title"
    updated_recipe["cooking_time"] = 45
    updated_recipe["ingredients"] = "updated ingredient 1, updated ingredient 2"
    updated_recipe["instructions"] = "Mix ingredients and cook for 45 minutes"
    update_response = client.put(f"/api/recipes/{recipe_id}", json=updated_recipe, headers=auth_headers)
    assert update_response.status_code == 200

    # Verify update
    get_response = client.get(f"/api/recipes/{recipe_id}")
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["title"] == updated_recipe["title"]
    assert data["cooking_time"] == updated_recipe["cooking_time"]
    assert data["ingredients"] == updated_recipe["ingredients"]
    assert data["instructions"] == updated_recipe["instructions"]


def test_delete_recipe(client: TestClient, test_recipe, auth_headers):
    """Test deleting a recipe."""
    # First, create a recipe
    create_response = client.post("/api/recipes/", json=test_recipe, headers=auth_headers)
    assert create_response.status_code == 200
    recipe_id = create_response.json()["id"]

    # Delete the recipe
    delete_response = client.delete(f"/api/recipes/{recipe_id}", headers=auth_headers)
    assert delete_response.status_code == 200

    # Verify deletion
    get_response = client.get(f"/api/recipes/{recipe_id}")
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == "Recipe not found"

