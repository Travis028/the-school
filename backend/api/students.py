from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import Optional, List
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

def serialize_student(s):
    return {
        "id": s.id,
        "user_id": s.user_id,
        "student_id": s.student_id,
        "class_name": s.class_name,
        "parent_name": s.parent_name,
        "parent_phone": s.parent_phone,
        "admission_date": str(s.admission_date),
        "user": {
            "id": s.user.id,
            "full_name": s.user.full_name,
            "username": s.user.username,
            "email": s.user.email,
        } if s.user else None,
    }

@router.get("/")
async def get_all_students(current_user: User = Depends(require_role(["admin", "teacher"])), db: Session = Depends(get_db)):
    students = db.query(Student).options(joinedload(Student.user)).all()
    return [serialize_student(s) for s in students]

@router.get("/me")
async def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).options(joinedload(Student.user)).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return serialize_student(student)

@router.post("/")
async def create_student(student: StudentCreate, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    db.refresh(db_student, ["user"])
    return serialize_student(db_student)

@router.get("/{student_id}")
async def get_student(student_id: int, current_user: User = Depends(require_role(["admin", "teacher", "student"])), db: Session = Depends(get_db)):
    student = db.query(Student).options(joinedload(Student.user)).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if current_user.role == "student" and current_user.id != student.user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return serialize_student(student)

@router.put("/{student_id}")
async def update_student(student_id: int, data: StudentUpdate, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in data.dict(exclude_none=True).items():
        setattr(student, key, value)
    db.commit()
    db.refresh(student)
    return serialize_student(student)

@router.delete("/{student_id}")
async def delete_student(student_id: int, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted"}
