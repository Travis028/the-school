from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.models import User
from core.security import require_role

router = APIRouter(prefix="/api/teachers", tags=["teachers"])

@router.get("/me")
async def get_teacher_profile(current_user: User = Depends(require_role(["teacher"])), db: Session = Depends(get_db)):
    teacher = db.query(User).filter(User.id == current_user.id).first()
    return teacher
