import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff'
              }
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff'
              }
            }
          }} 
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<PrivateRoute allowedRoles={['student']}><StudentDashboard /></PrivateRoute>} />
          <Route path="/teacher-dashboard" element={<PrivateRoute allowedRoles={['teacher']}><TeacherDashboard /></PrivateRoute>} />
          <Route path="/admin-dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
