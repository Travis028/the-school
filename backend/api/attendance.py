from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
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

def serialize_attendance(a):
    return {
        "id": a.id,
        "student_id": a.student_id,
        "date": str(a.date),
        "status": a.status,
        "remarks": a.remarks,
        "student": {
            "id": a.student.id,
            "student_id": a.student.student_id,
            "user": {
                "full_name": a.student.user.full_name,
            } if a.student and a.student.user else None,
        } if a.student else None,
    }

@router.get("/")
async def get_all_attendance(current_user: User = Depends(require_role(["admin", "teacher"])), db: Session = Depends(get_db)):
    records = db.query(Attendance).options(joinedload(Attendance.student).joinedload(Student.user)).all()
    return [serialize_attendance(a) for a in records]

@router.get("/me")
async def get_my_attendance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []
    records = db.query(Attendance).filter(Attendance.student_id == student.id).all()
    return [serialize_attendance(a) for a in records]

@router.post("/")
async def mark_attendance(attendance: AttendanceCreate, current_user: User = Depends(require_role(["admin", "teacher"])), db: Session = Depends(get_db)):
    db_att = Attendance(**attendance.dict())
    db.add(db_att)
    db.commit()
    db.refresh(db_att)
    db_att = db.query(Attendance).options(joinedload(Attendance.student).joinedload(Student.user)).filter(Attendance.id == db_att.id).first()
    return serialize_attendance(db_att)

@router.delete("/{attendance_id}")
async def delete_attendance(attendance_id: int, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Attendance record deleted"}
