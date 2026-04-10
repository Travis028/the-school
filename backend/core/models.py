from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    student_profile = relationship("Student", back_populates="user", uselist=False)
    teacher_profile = relationship("Teacher", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    student_id = Column(String, unique=True, index=True)
    class_name = Column(String)
    parent_name = Column(String)
    parent_phone = Column(String)
    admission_date = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="student_profile")
    attendances = relationship("Attendance", back_populates="student", cascade="all, delete")
    grades = relationship("Grade", back_populates="student", cascade="all, delete")

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    employee_id = Column(String, unique=True, index=True)
    department = Column(String)
    qualification = Column(String)
    joining_date = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="teacher_profile")
    subjects = relationship("Subject", back_populates="teacher")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    teacher = relationship("Teacher", back_populates="subjects")

class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(Boolean, default=True)
    remarks = Column(String, nullable=True)
    student = relationship("Student", back_populates="attendances")

class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject = Column(String)
    marks_obtained = Column(Float)
    total_marks = Column(Float)
    exam_type = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    student = relationship("Student", back_populates="grades")

class Notice(Base):
    __tablename__ = "notices"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    target_role = Column(Enum(UserRole), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
