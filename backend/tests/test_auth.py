import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models import User
from app.auth import get_password_hash
from app.database import get_db

@pytest.fixture
def client():
    """Fixture to create a FastAPI TestClient."""
    return TestClient(app)

@pytest.fixture
def db_session(db):
    yield db


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

def test_login(client, db_session, test_user):
    """Test that a user can log in and receive a JWT token."""
    response = client.post(
        "/api/login",
        data={"email": "testuser@example.com", "password": "password1"},  # Keep 'email' as in cURL
    )
    
    assert response.status_code == 200
    data = response.json()
    print(f"This is the data {data}") # Debugging line
    
    assert "access_token" in data  # Check if token exists
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "testuser@example.com"

def test_register(client, db_session):
    """Test that a user can register and receive a JWT token."""
    response = client.post(
        "/api/register",
        json={"username": "newuser", "email": "newuser@test.net", "password": "password1"},
    )
    assert response.status_code == 200
    data = response.json()
    print(f"This is the data {data}") # Debugging line
    assert data["id"] == 1
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@test.net"
    
