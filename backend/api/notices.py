from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.models import User, Notice
from core.security import require_role

router = APIRouter(prefix="/api/notices", tags=["notices"])

@router.get("/")
async def get_notices(current_user: User = Depends(require_role(["admin", "teacher", "student"])), db: Session = Depends(get_db)):
    notices = db.query(Notice).filter((Notice.target_role == None) | (Notice.target_role == current_user.role)).all()
    return notices
