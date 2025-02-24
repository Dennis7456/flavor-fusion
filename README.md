### Repository: `recipe-planner-app`  

# 🍽️ Recipe Management & Meal Planning Platform  

## Overview  
This is a full-stack recipe management and meal planning application. Users can create, browse, and save their favorite recipes. The application features a fully functional frontend built with React and a backend powered by FastAPI with PostgreSQL.  

## 🛠️ Tech Stack  

### Frontend  
- **React** (with Vite)  
- **TypeScript**  
- **React Query** (for API state management)  
- **TailwindCSS** (for styling)  
- **Vitest** (for component testing)  

### Backend  
- **FastAPI** (for API development)  
- **PostgreSQL** (for database)  
- **SQLAlchemy** (for ORM)  
- **Pydantic** (for data validation)  
- **Alembic** (for database migrations)  

## 🚀 Features  

### Core Features  
✅ Recipe Management (Create, Read, Update, Delete)  
✅ Recipe Filtering by Cuisine & Cooking Time  
✅ Favorite/Save Recipes Feature  
✅ Optimistic UI Updates  
✅ Responsive Design  
✅ API Documentation with OpenAPI/Swagger  

### Bonus Features (If Implemented)  
✨ Recipe Search with Ingredient Filtering  
✨ Sorting Options for Recipes  
✨ Basic Authentication System  
✨ Shopping List Generator  

## 📂 Project Structure  
```
/recipe-planner-app
│── frontend/        # React application  
│── backend/         # FastAPI backend  
│── .env.example     # Environment variables template  
│── README.md        # Documentation  
│── docker-compose.yml # Docker setup  
│── tests/           # Unit tests  
```  

## ⚡ Setup & Installation  

### Prerequisites  
- **Node.js** (v18+)  
- **Python** (v3.10+)  
- **PostgreSQL** (Installed & Running)  
- **Docker** (Optional, for containerized setup)  

### 🔧 Backend Setup  

1. Clone the repository  
   ```sh
   git clone git@github.com:Dennis7456/flavor-fusion.git
   cd recipe-planner-app/backend
   ```  
2. Create and activate a virtual environment  
   ```sh
   python -m venv venv  
   source venv/bin/activate  # On Windows: venv\Scripts\activate  
   ```  
3. Install dependencies  
   ```sh
   pip install -r requirements.txt  
   ```  
4. Set up environment variables  
   ```sh
   cp .env.example .env  
   ```  
5. Apply database migrations  
   ```sh
   alembic upgrade head  
   ```  
6. Run the backend server  
   ```sh
   uvicorn main:app --reload  
   ```  

### 🖥️ Frontend Setup  

1. Navigate to the frontend directory  
   ```sh
   cd ../frontend  
   ```  
2. Install dependencies  
   ```sh
   npm install  
   ```  
3. Start the frontend  
   ```sh
   npm run dev  
   ```  

## 🛠️ Running Tests  

### Backend Tests  
```sh
PYTHONPATH=. pytest
```  

### Frontend Tests  
```sh
npm run test  
```  

## 📌 API Documentation  
Once the backend is running, access the API documentation at:  
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)  
- **Redoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)  

## 📝 What Could Be Improved With More Time  
- Implementing a full authentication system (JWT-based login/logout)  
- Adding end-to-end testing with Cypress  
- Improving accessibility (ARIA attributes, keyboard navigation)  
- Caching API requests for performance optimization  
- Deploying the app to cloud services (AWS/GCP)  

## 🤝 Contribution  
Feel free to fork this project, make improvements, and submit a pull request!  

---