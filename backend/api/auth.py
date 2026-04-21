from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from core.models import User, UserSession
from core.security import verify_password, create_access_token, get_password_hash, get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/auth", tags=["authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    username: str
    full_name: str
    password: str
    role: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"user_id": user.id, "role": user.role}, db=db)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "full_name": user.full_name, "role": user.role, "email": user.email}
    }

@router.post("/register")
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.username == request.username) | (User.email == request.email)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username or email already exists")
    new_user = User(
        email=request.email,
        username=request.username,
        full_name=request.full_name,
        hashed_password=get_password_hash(request.password),
        role=request.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Account created successfully", "user_id": new_user.id}

@router.get("/me")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username, "full_name": current_user.full_name, "role": current_user.role, "email": current_user.email}

@router.post("/change-password")
async def change_password(request: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(request.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    current_user.hashed_password = get_password_hash(request.new_password)
    db.commit()
    return {"message": "Password changed successfully"}

@router.get("/online-users")
async def get_online_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Get active sessions from last 5 minutes
    five_minutes_ago = datetime.utcnow() - timedelta(minutes=5)
    active_sessions = db.query(UserSession).filter(
        UserSession.is_active == True,
        UserSession.last_activity >= five_minutes_ago
    ).all()
    
    online_users = []
    for session in active_sessions:
        online_duration = datetime.utcnow() - session.login_time
        hours = int(online_duration.total_seconds() // 3600)
        minutes = int((online_duration.total_seconds() % 3600) // 60)
        
        online_users.append({
            "id": session.user.id,
            "username": session.user.username,
            "full_name": session.user.full_name,
            "role": session.user.role,
            "email": session.user.email,
            "login_time": session.login_time.isoformat(),
            "last_activity": session.last_activity.isoformat(),
            "online_duration": {
                "hours": hours,
                "minutes": minutes,
                "formatted": f"{hours}h {minutes}m"
            },
            "session_id": session.session_id
        })
    
    return {
        "online_users": online_users,
        "total_online": len(online_users),
        "timestamp": datetime.utcnow().isoformat()
    }
