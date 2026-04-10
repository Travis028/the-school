from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from core.models import User, Student, Grade
from core.security import require_role, get_current_user

router = APIRouter(prefix="/api/grades", tags=["grades"])

class GradeCreate(BaseModel):
    student_id: int
    subject: str
    marks_obtained: float
    total_marks: float
    exam_type: str

@router.get("/")
async def get_all_grades(current_user: User = Depends(require_role(["admin", "teacher"])), db: Session = Depends(get_db)):
    return db.query(Grade).all()

@router.get("/me")
async def get_my_grades(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []
    return db.query(Grade).filter(Grade.student_id == student.id).all()

@router.post("/")
async def create_grade(grade: GradeCreate, current_user: User = Depends(require_role(["admin", "teacher"])), db: Session = Depends(get_db)):
    db_grade = Grade(**grade.dict())
    db.add(db_grade)
    db.commit()
    db.refresh(db_grade)
    return db_grade

@router.delete("/{grade_id}")
async def delete_grade(grade_id: int, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    db.delete(grade)
    db.commit()
    return {"message": "Grade deleted"}
