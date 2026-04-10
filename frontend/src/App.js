import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/student-dashboard" element={<PrivateRoute allowedRoles={['student']}><StudentDashboard /></PrivateRoute>} />
          <Route path="/teacher-dashboard" element={<PrivateRoute allowedRoles={['teacher']}><TeacherDashboard /></PrivateRoute>} />
          <Route path="/admin-dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
