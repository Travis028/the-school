import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchStudentData(); }, []);

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  const fetchStudentData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:8000/api/students/${user.id}`, getAuthHeaders());
      setStudentData(response.data);
    } catch (error) {
      toast.error('Failed to load student data');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center"><h1 className="text-xl font-bold text-gray-800">Student Portal</h1></div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Student</span>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
          <p className="text-gray-600">Welcome to your student portal. Here you can view attendance, grades, and notices.</p>
          {studentData && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Student ID:</strong> {studentData.student_id}</div>
              <div><strong>Class:</strong> {studentData.class_name}</div>
              <div><strong>Parent Name:</strong> {studentData.parent_name}</div>
              <div><strong>Parent Phone:</strong> {studentData.parent_phone}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
