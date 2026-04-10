from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
from api import auth, students, teachers, notices, grades, attendance, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Akilli School Management System API",
    version="1.0.0",
    redirect_slashes=False
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(students.router)
app.include_router(teachers.router)
app.include_router(notices.router)
app.include_router(grades.router)
app.include_router(attendance.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "Akilli School Management System API"}
