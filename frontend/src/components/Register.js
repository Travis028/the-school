import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '', confirm_password: '', role: 'student' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/auth/register', {
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center font-bold text-yellow-400 text-2xl mx-auto mb-3">A</div>
          <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-500 text-sm mt-1">Akilli School Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="full_name" value={form.full_name} onChange={handleChange}
              placeholder="e.g. John Doe" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input name="username" value={form.username} onChange={handleChange}
              placeholder="e.g. johndoe" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange}
              placeholder="e.g. john@email.com" type="email" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" value={form.password} onChange={handleChange}
              placeholder="Min. 6 characters" type="password" required minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input name="confirm_password" value={form.confirm_password} onChange={handleChange}
              placeholder="Repeat your password" type="password" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-900 text-white py-2.5 rounded-lg hover:bg-blue-800 transition font-semibold disabled:opacity-50 mt-2">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-700 font-semibold hover:underline">Login here</Link>
        </p>

        <p className="text-center text-sm text-gray-500 mt-2">
          <Link to="/" className="hover:underline">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
