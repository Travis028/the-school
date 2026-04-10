from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from core.database import get_db
from core.models import User, Student, Attendance
from core.security import require_role, get_current_user

router = APIRouter(prefix="/api/attendance", tags=["attendance"])

class AttendanceCreate(BaseModel):
    student_id: int
    status: bool
    remarks: Optional[str] = None

@router.get("/")
async def get_all_attendance(current_user: User = Depends(require_role(["admin", "teacher"])), db: Session = Depends(get_db)):
    return db.query(Attendance).all()

@router.get("/me")
async def get_my_attendance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []
    return db.query(Attendance).filter(Attendance.student_id == student.id).all()

@router.post("/")
async def mark_attendance(attendance: AttendanceCreate, current_user: User = Depends(require_role(["admin", "teacher"])), db: Session = Depends(get_db)):
    db_attendance = Attendance(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@router.delete("/{attendance_id}")
async def delete_attendance(attendance_id: int, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Attendance record deleted"}
