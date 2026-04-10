from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from core.database import get_db
from core.models import User, Student
from core.security import require_role, get_current_user

router = APIRouter(prefix="/api/students", tags=["students"])

class StudentCreate(BaseModel):
    user_id: int
    student_id: str
    class_name: str
    parent_name: str
    parent_phone: str

class StudentUpdate(BaseModel):
    class_name: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

@router.get("/")
async def get_all_students(current_user: User = Depends(require_role(["admin", "teacher"])), db: Session = Depends(get_db)):
    return db.query(Student).all()

@router.get("/me")
async def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student

@router.post("/")
async def create_student(student: StudentCreate, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.get("/{student_id}")
async def get_student(student_id: int, current_user: User = Depends(require_role(["admin", "teacher", "student"])), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if current_user.role == "student" and current_user.id != student.user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return student

@router.put("/{student_id}")
async def update_student(student_id: int, data: StudentUpdate, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in data.dict(exclude_none=True).items():
        setattr(student, key, value)
    db.commit()
    db.refresh(student)
    return student

@router.delete("/{student_id}")
async def delete_student(student_id: int, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted"}
