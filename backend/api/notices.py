from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from core.database import get_db
from core.models import User, Notice
from core.security import require_role, get_current_user

router = APIRouter(prefix="/api/notices", tags=["notices"])

class NoticeCreate(BaseModel):
    title: str
    content: str
    target_role: Optional[str] = None

@router.get("/")
async def get_notices(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Notice).filter(
        (Notice.target_role == None) | (Notice.target_role == current_user.role)
    ).order_by(Notice.created_at.desc()).all()

@router.post("/")
async def create_notice(notice: NoticeCreate, current_user: User = Depends(require_role(["admin", "teacher"])), db: Session = Depends(get_db)):
    db_notice = Notice(**notice.dict(), created_by=current_user.id)
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)
    return db_notice

@router.delete("/{notice_id}")
async def delete_notice(notice_id: int, current_user: User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(notice)
    db.commit()
    return {"message": "Notice deleted"}
