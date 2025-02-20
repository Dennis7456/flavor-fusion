from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_recipe():
    response = client.post("/api/recipes/", json={"title": "Pasta", "cuisine_type": "Italian", "cooking_time": 30, "ingredients": "Pasta, Sauce", "instructions": "Cook and serve"})
    assert response.status_code == 200
    assert response.json()["title"] == "Pasta"