# Akilli School - School Management System

A full-stack school management application built with modern web technologies. This system provides separate dashboards for administrators, teachers, and students to manage attendance, grades, notices, and student information.

## Live Demo

**Live Application:** [https://the-school-t3go.onrender.com](https://the-school-t3go.onrender.com)

> **Note:** The application is fully deployed on Render. The frontend communicates with the backend via REST API calls over HTTPS.

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.x** | Server-side programming language |
| **FastAPI** | Modern web framework for building APIs |
| **SQLAlchemy** | ORM for database operations |
| **Uvicorn** | ASGI server for running FastAPI |
| **Pydantic** | Data validation using Python type hints |
| **Python-Jose** | JWT token handling |
| **Passlib** | Password hashing with bcrypt |
| **python-multipart** | Form data parsing for file uploads |

### Frontend
| Technology | Purpose |
|------------|---------|
| **JavaScript (ES6+)** | Client-side programming language |
| **React 18** | UI library for building user interfaces |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API requests |
| **Tailwind CSS** | Utility-first CSS framework |
| **Heroicons** | Icon library |
| **React Hot Toast** | Toast notifications |
| **React Scripts** | Build and development scripts |

### Database
| Technology | Purpose |
|------------|---------|
| **SQLite** | Lightweight SQL database (development) |

---

## 📁 Project Structure

```
the-school/
├── backend/                    # FastAPI backend
│   ├── main.py                # Application entry point
│   ├── seed.py                # Database seeding script
│   ├── requirements.txt       # Python dependencies
│   ├── api/                   # API endpoints
│   │   ├── admin.py          # Admin-specific endpoints
│   │   ├── attendance.py     # Attendance management
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── grades.py         # Grade management
│   │   ├── notices.py        # Notice board
│   │   ├── students.py       # Student operations
│   │   └── teachers.py       # Teacher operations
│   └── core/                  # Core functionality
│       ├── database.py       # Database configuration
│       ├── models.py         # SQLAlchemy models
│       └── security.py       # Auth & password utilities
│
├── frontend/                   # React frontend
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── index.js          # React entry point
│   │   ├── index.css         # Global styles
│   │   ├── components/       # React components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Badge.js
│   │   │   ├── Button.js
│   │   │   ├── DashboardLayout.js
│   │   │   ├── ErrorBoundary.js
│   │   │   ├── LandingPage.js
│   │   │   ├── LoadingSkeleton.js
│   │   │   ├── Login.js
│   │   │   ├── Modal.js
│   │   │   ├── PrivateRoute.js
│   │   │   ├── Register.js
│   │   │   ├── ResponsiveGrid.js
│   │   │   ├── StudentDashboard.js
│   │   │   └── TeacherDashboard.js
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useDebounce.js
│   │   │   ├── useLocalStorage.js
│   │   │   └── useOnlineStatus.js
│   │   └── utils/            # Utility functions
│   │       └── constants.js
│   ├── package.json          # Node.js dependencies
│   ├── tailwind.config.js    # Tailwind configuration
│   └── package.json
│
├── netlify.toml              # Netlify config (legacy)
├── render.yaml               # Render deployment config
├── package.json              # Root package.json
└── README.md                 # This file
```

---

## ✨ Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Teacher, Student)
- Secure password hashing with bcrypt

### Admin Dashboard
- Manage students and teachers
- View all attendance records
- Access to all system features

### Teacher Dashboard
- Take and manage attendance
- Add and update student grades
- Post notices for students

### Student Dashboard
- View personal attendance
- Check grades and notices
- View assigned teacher information

---

## Architecture & How It Works

### System Overview

The School Management System follows a **client-server architecture** with a RESTful API:

```
┌─────────────────────┐         ┌─────────────────────┐
│   React Frontend    │◄───────►│   FastAPI Backend   │
│   (Render Static)   │  HTTPS  │   (Render Service)  │
└─────────────────────┘         └─────────────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │   SQLite    │
                                       │  Database   │
                                       └─────────────┘
```

**Deployment:** Both frontend and backend are hosted on **Render** - the frontend as a static site and the backend as a web service.

### Backend (FastAPI)

The backend is built with **FastAPI** and provides a RESTful API:

1. **Entry Point** - [main.py](backend/main.py) initializes the FastAPI app with title "Akilli School Management System API"
2. **CORS Middleware** - Allows cross-origin requests from the frontend (configured for `http://localhost:3000` in development, and production URL when deployed)
3. **Database** - SQLAlchemy ORM connects to SQLite database
4. **API Routes** - Modular route handlers for each feature:
   - `auth.py` - User registration and login (JWT tokens)
   - `students.py` - Student CRUD operations
   - `teachers.py` - Teacher CRUD operations
   - `attendance.py` - Attendance tracking
   - `grades.py` - Grade management
   - `notices.py` - Notice board
   - `admin.py` - Admin-specific endpoints

### Frontend (React)

The frontend is a **Single Page Application (SPA)** built with React:

1. **Routing** - React Router handles client-side navigation
2. **State Management** - React hooks (`useState`, `useEffect`) manage component state
3. **HTTP Client** - Axios makes API calls to the backend
4. **Authentication** - JWT tokens stored in localStorage for session management
5. **UI Components** - Reusable components with Tailwind CSS styling

### Frontend-Backend Connection

The frontend connects to the backend via **Axios HTTP client**. Each dashboard component creates an axios instance with the JWT token:

```javascript
// Example: API configuration from dashboard components
import axios from 'axios';

const api = (token) => axios.create({
  baseURL: 'http://localhost:8000',  // Backend URL (local development)
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
```

**Note:** The frontend uses `http://localhost:8000` for local development. When deployed, update the `baseURL` to point to your production backend URL.

### Authentication Flow

The system supports **two authentication methods**:

1. **Demo Accounts (Mock Auth)** - Pre-configured accounts for quick testing:
   - `john123` / `student123` (Student)
   - `jane456` / `student456` (Student)
   - `teacher789` / `teacher789` (Teacher)
   - `educator012` / `educator012` (Teacher)
   - `admin` / `admin123` (Admin)

2. **Real Backend Authentication** - Full JWT-based auth:
   - **Register** - User creates account via `/api/auth/register`
   - **Login** - User receives JWT token via `/api/auth/login`
   - **Token Storage** - Token saved in localStorage
   - **Protected Routes** - Token sent in `Authorization` header for protected endpoints
   - **Role-Based Access** - Backend checks user role (Admin/Teacher/Student) for authorization

### Database Schema

The system uses **SQLite** with SQLAlchemy ORM. The main models are:

| Model | Description |
|-------|-------------|
| **User** | Base user with email, username, hashed_password, role (Admin/Teacher/Student) |
| **Student** | Extends User with class_name, parent_name, parent_phone |
| **Teacher** | Extends User with department, qualification, subjects |
| **Subject** | Academic subjects assigned to teachers |
| **Attendance** | Tracks student attendance (date, status, remarks) |
| **Grade** | Student grades (subject, marks_obtained, total_marks, exam_type) |
| **Notice** | Announcements posted by teachers/admins |
| **UserSession** | Session tracking for user logins |

---

## Getting Started

### Prerequisites
- **Python 3.8+** (Backend)
- **Node.js 14+** (Frontend)
- **npm** or **yarn**

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/students` | List all students |
| GET | `/api/teachers` | List all teachers |
| POST | `/api/attendance` | Create attendance record |
| GET | `/api/grades` | Get grades |
| POST | `/api/grades` | Add new grade |
| GET | `/api/notices` | Get all notices |
| POST | `/api/notices` | Create notice |

---

## 🔧 Deployment

The project is deployed and accessible at:

- **Live Application:** [https://the-school-t3go.onrender.com](https://the-school-t3go.onrender.com)

### Deployment Configuration

- **Frontend & Backend** - Both deployed on [Render](https://render.com/) via [render.yaml](render.yaml)

### Running Locally

To run the entire stack locally:

```bash
# Terminal 1 - Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
# Backend runs at http://localhost:8000

# Terminal 2 - Frontend
cd frontend
npm install
npm start
# Frontend runs at http://localhost:3000
```

For local development, the frontend is configured to connect to `http://localhost:8000`. Update the `baseURL` in the dashboard components if your backend runs on a different port.

---

## 📄 License

MIT License
