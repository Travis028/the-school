import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', { username, password });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success(`Welcome back, ${user.full_name}!`);
      if (user.role === 'admin') navigate('/admin-dashboard');
      else if (user.role === 'teacher') navigate('/teacher-dashboard');
      else navigate('/student-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-16">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-black text-white text-xl">A</div>
            <div>
              <p className="font-black text-white text-xl">Akilli School</p>
              <p className="text-blue-300 text-sm">Excellence in Education</p>
            </div>
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Welcome Back to <span className="text-yellow-400">Akilli</span> School Portal
          </h2>
          <p className="text-blue-200 leading-relaxed">
            Access your personalized dashboard to manage academics, attendance, grades, and stay connected with the school community.
          </p>
        </div>
        <div className="relative z-10 space-y-4">
          {[
            { role: 'Student', desc: 'View grades, attendance & notices', color: 'bg-green-500' },
            { role: 'Teacher', desc: 'Manage classes & student records', color: 'bg-blue-400' },
            { role: 'Admin', desc: 'Full system management', color: 'bg-purple-500' },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
              <span className={`${p.color} w-2 h-2 rounded-full`}></span>
              <span className="text-white font-semibold text-sm">{p.role}</span>
              <span className="text-blue-300 text-xs">— {p.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center font-black text-white">A</div>
            <div>
              <p className="font-black text-gray-900">Akilli School</p>
              <p className="text-blue-600 text-xs">Excellence in Education</p>
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-500 mb-8">Enter your credentials to access your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder-gray-400 pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3.5 rounded-xl font-bold text-base hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-700 font-semibold hover:underline">Create one here</Link>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              <Link to="/" className="hover:text-gray-600 transition">← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
