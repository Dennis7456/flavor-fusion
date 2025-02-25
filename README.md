# 🍽️ Recipe Planner App  

**Your All-in-One Meal Planning Solution**  
Effortlessly organize recipes, plan meals, and generate shopping lists with this full-stack application. Built with React, FastAPI, and PostgreSQL.  

---

## 🌟 Features  

### Core Features  
✅ **Recipe Management**  
Create, browse, update, and delete recipes with ease.  

✅ **Smart Filtering**  
Filter recipes by cuisine type, cooking time, or dietary preferences.  

✅ **Favorites System**  
Save your go-to recipes for quick access.  

✅ **Optimistic UI**  
Instant interface updates for a seamless user experience.  

✅ **Responsive Design**  
Works flawlessly on desktop, tablet, and mobile.  

✅ **API Documentation**  
Integrated Swagger/OpenAPI docs for easy backend exploration.  

### Upcoming Features (Roadmap)  
🔜 **Ingredient Search**  
🔜 **User Authentication**  
🔜 **Shopping List Generator**  
🔜 **Meal Calendar Integration**  

---

## 🛠️ Tech Stack  

| Frontend               | Backend                | Database         | Tools            |  
|------------------------|------------------------|------------------|------------------|  
| React + TypeScript     | FastAPI                | PostgreSQL       | Docker           |  
| React Query            | SQLAlchemy (ORM)       | Alembic          | TailwindCSS      |  
| Vite                   | Pydantic (Validation)  |                  | Vitest           |  

---

## 🚀 Quick Start  

### Prerequisites  
- Node.js v18+  
- Python 3.10+  
- PostgreSQL (running locally)  
- Docker (optional)  

### Full Setup Guide  

1. **Clone Repository**  
   ```bash
   git clone git@github.com:Dennis7456/flavor-fusion.git
   cd flavor-fusion
   ```

2. **Backend Setup**  
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment**  
   ```bash
   cd ..
   cp ../.env.example ../.env  # Update values in .env file
   ```

4. **Database Setup**  
   ```bash
   cd backend
   alembic init migrations
   # Configure alembic.ini and migrations/env.py with your DB URL
   alembic revision --autogenerate -m "initial migration"
   alembic upgrade head
   ```

5. **Launch Backend**  
   ```bash
   python seed.py
   uvicorn app.main:app --reload
   ```

6. **Frontend Setup**  
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📂 Project Structure  
```  
recipe-planner-app/  
├── frontend/            # React components, hooks, tests  
├── backend/             # API routes, models, migrations  
├── tests/               # Unit/integration tests  
├── docker-compose.yml   # Container configuration  
└── .env.example         # Environment template  
```  

---

## 🔍 Explore the API  
Access interactive documentation after launching the backend:  
- **Swagger UI**: `http://localhost:8000/docs`  
- **Redoc**: `http://localhost:8000/redoc`  

---

## 🧪 Testing  
**Backend Tests**  
```bash
PYTHONPATH=. pytest -v
```  

**Frontend Tests**  
```bash
cd frontend && npm test
```  

---

## 🛠️ Future Improvements  
- Implement JWT authentication  
- Add meal prep scheduling  
- Develop grocery list export  
- Enhance search with AI suggestions  
- Create nutrition tracking  

---

## 🤝 Contribute  
We welcome contributions! Please:  
1. Fork the repository  
2. Create a feature branch  
3. Submit a PR with detailed notes  

--- 

**Happy Cooking!** 👨🍳👩🍳