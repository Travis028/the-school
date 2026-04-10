from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from core.database import get_db
from core.models import User, Teacher
from core.security import require_role, get_current_user

router = APIRouter(prefix="/api/teachers", tags=["teachers"])

class TeacherCreate(BaseModel):
    user_id: int
    employee_id: str
    department: str
    qualification: str

class TeacherUpdate(BaseModel):
    department: Optional[str] = None
    qualification: Optional[str] = None

@router.get("/")
async def get_all_teachers(current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    return db.query(Teacher).all()

@router.get("/me")
async def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
    return teacher

@router.post("/")
async def create_teacher(teacher: TeacherCreate, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    db_teacher = Teacher(**teacher.dict())
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher

@router.put("/{teacher_id}")
async def update_teacher(teacher_id: int, data: TeacherUpdate, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    for key, value in data.dict(exclude_none=True).items():
        setattr(teacher, key, value)
    db.commit()
    db.refresh(teacher)
    return teacher

@router.delete("/{teacher_id}")
async def delete_teacher(teacher_id: int, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    db.delete(teacher)
    db.commit()
    return {"message": "Teacher deleted"}
