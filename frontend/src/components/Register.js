import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, AcademicCapIcon, LockClosedIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '', confirm_password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
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
      toast.success('Account created. You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 flex-col justify-between p-12">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-16 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-purple-900 text-xl shadow-2xl group-hover:scale-110 transition-transform duration-300">A</div>
            <div>
              <p className="font-black text-white text-sm leading-none">Akilli School</p>
              <p className="text-gray-400 text-xs">Nairobi, Kenya</p>
            </div>
          </Link>
          <h2 className="text-3xl font-black text-white leading-tight mb-4">
            Create your Akilli School account
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Register to access the school management portal. Once your account is created, you can log in and access your dashboard immediately.
          </p>
          <div className="space-y-4">
            {[
              'View your grades and academic performance',
              'Track your attendance record',
              'Receive school notices and announcements',
              'Communicate with teachers and administration',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span className="text-gray-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} Akilli School. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-800 flex items-center justify-center font-black text-white text-sm">A</div>
              <p className="font-black text-gray-900">Akilli School</p>
            </Link>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm mb-8">Fill in your details to register</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange}
                placeholder="e.g. John Kamau" required
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                <input name="username" value={form.username} onChange={handleChange}
                  placeholder="johnkamau" required
                  className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input name="email" value={form.email} onChange={handleChange}
                placeholder="john@email.com" type="email" required
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input name="password" value={form.password} onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  type={showPassword ? 'text' : 'password'} required
                  className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition pr-16" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-800 font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <input name="confirm_password" value={form.confirm_password} onChange={handleChange}
                placeholder="Repeat your password" type="password" required
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-800 text-white py-3 text-sm font-bold hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-700 font-semibold hover:underline">Sign in here</Link>
            </p>
            <p className="text-sm text-gray-400">
              <Link to="/" className="hover:text-gray-600 transition">Back to school website</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
