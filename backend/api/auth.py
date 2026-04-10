from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from core.models import User
from core.security import verify_password, create_access_token, get_password_hash, get_current_user

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
    access_token = create_access_token(data={"user_id": user.id, "role": user.role})
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
