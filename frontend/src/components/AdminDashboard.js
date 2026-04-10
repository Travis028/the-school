import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

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
            <div className="flex items-center"><h1 className="text-xl font-bold text-gray-800">Admin Portal</h1></div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin</span>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <p className="text-gray-600">Manage students, teachers, classes, and system settings.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">Manage Users</button>
            <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700">Manage Classes</button>
            <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700">Fee Structure</button>
            <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700">Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
