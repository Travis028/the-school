from core.database import SessionLocal, engine, Base
from core.models import User, UserRole, Student, Teacher, Notice
from core.security import get_password_hash

Base.metadata.create_all(bind=engine)
db = SessionLocal()

def seed_users():
    users = [
        User(email="admin@akillischool.ac.ke", username="admin", full_name="Admin User", hashed_password=get_password_hash("admin123"), role=UserRole.ADMIN),
        User(email="teacher1@akillischool.ac.ke", username="teacher", full_name="Mr. James Omondi", hashed_password=get_password_hash("teacher123"), role=UserRole.TEACHER),
        User(email="teacher2@akillischool.ac.ke", username="teacher2", full_name="Ms. Grace Wanjiku", hashed_password=get_password_hash("teacher123"), role=UserRole.TEACHER),
        User(email="student1@akillischool.ac.ke", username="student", full_name="Alice Kamau", hashed_password=get_password_hash("student123"), role=UserRole.STUDENT),
        User(email="student2@akillischool.ac.ke", username="student2", full_name="Brian Otieno", hashed_password=get_password_hash("student123"), role=UserRole.STUDENT),
        User(email="student3@akillischool.ac.ke", username="student3", full_name="Carol Mwangi", hashed_password=get_password_hash("student123"), role=UserRole.STUDENT),
    ]
    created = []
    for u in users:
        existing = db.query(User).filter(User.username == u.username).first()
        if not existing:
            db.add(u)
            db.flush()
            created.append(u)
    db.commit()
    print(f"Seeded {len(created)} users")
    return created

def seed_students(users):
    student_users = db.query(User).filter(User.role == UserRole.STUDENT).all()
    classes = ["Form 1A", "Form 2B", "Form 3A"]
    parents = [("John Kamau", "+254711000001"), ("Peter Otieno", "+254711000002"), ("Mary Mwangi", "+254711000003")]
    for i, u in enumerate(student_users):
        existing = db.query(Student).filter(Student.user_id == u.id).first()
        if not existing:
            db.add(Student(user_id=u.id, student_id=f"AKL{2025}{i+1:03d}", class_name=classes[i % 3], parent_name=parents[i % 3][0], parent_phone=parents[i % 3][1]))
    db.commit()
    print("Seeded students")

def seed_teachers(users):
    teacher_users = db.query(User).filter(User.role == UserRole.TEACHER).all()
    depts = ["Mathematics", "Sciences"]
    for i, u in enumerate(teacher_users):
        existing = db.query(Teacher).filter(Teacher.user_id == u.id).first()
        if not existing:
            db.add(Teacher(user_id=u.id, employee_id=f"TCH{2025}{i+1:03d}", department=depts[i % 2], qualification="B.Ed"))
    db.commit()
    print("Seeded teachers")

def seed_notices():
    notices_data = [
        Notice(title="Welcome Back!", content="Welcome to Term 1, 2025. Classes begin on Monday 6th January.", created_by=1),
        Notice(title="Fee Payment Deadline", content="All school fees must be paid by 31st January 2025.", created_by=1),
        Notice(title="Sports Day", content="Annual Sports Day will be held on 15th February 2025.", created_by=1),
        Notice(title="Exam Timetable Released", content="Mid-term exam timetable is now available on the portal.", target_role=UserRole.STUDENT, created_by=1),
        Notice(title="Staff Meeting", content="All teachers are required to attend the staff meeting on Friday at 4PM.", target_role=UserRole.TEACHER, created_by=1),
    ]
    for n in notices_data:
        db.add(n)
    db.commit()
    print("Seeded notices")

seed_users()
seed_students([])
seed_teachers([])
seed_notices()
db.close()
print("All data seeded successfully!")
