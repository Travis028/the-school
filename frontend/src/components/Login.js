import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, AcademicCapIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

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
      toast.success('Login successful');
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
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 flex-col justify-between p-12">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-16 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-blue-900 text-xl shadow-2xl group-hover:scale-110 transition-transform duration-300">A</div>
            <div>
              <p className="font-black text-white text-lg leading-none bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text">Akilli School</p>
              <p className="text-blue-300 text-sm mt-1">Nairobi, Kenya</p>
            </div>
          </Link>
          <h2 className="text-4xl font-black text-white leading-tight mb-6">
            Welcome back to the <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">Akilli School</span> Portal
          </h2>
          <p className="text-blue-200 text-base leading-relaxed">
            Log in to access your personalized dashboard. Students can view grades and attendance. Teachers can manage classes and records. Administrators have full system access.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { role: 'Student', desc: 'Grades, attendance and notices' },
            { role: 'Teacher', desc: 'Class management and records' },
            { role: 'Administrator', desc: 'Full system management' },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-3 border border-blue-700 px-4 py-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
              <span className="text-white text-sm font-semibold">{p.role}</span>
              <span className="text-blue-400 text-xs ml-auto">{p.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-800 flex items-center justify-center font-black text-white text-sm">A</div>
              <p className="font-black text-gray-900">Akilli School</p>
            </Link>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-2">Sign In</h1>
          <p className="text-gray-600 text-base mb-8">Enter your username and password to continue</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 bg-white text-gray-900 text-sm rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 text-base font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-center">
            <p className="text-sm text-gray-500">
              No account yet?{' '}
              <Link to="/register" className="text-blue-700 font-semibold hover:underline">Register here</Link>
            </p>
            <p className="text-sm text-gray-400">
              <Link to="/" className="hover:text-gray-600 transition">Back to school website</Link>
            </p>
          </div>

          <div className="mt-6 border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="space-y-1">
              {[
                { role: 'Admin', username: 'admin', password: 'admin123' },
                { role: 'Teacher', username: 'teacher', password: 'teacher123' },
                { role: 'Student', username: 'student', password: 'student123' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 w-14">{c.role}</span>
                  <button
                    type="button"
                    onClick={() => { setUsername(c.username); setPassword(c.password); }}
                    className="text-blue-700 hover:underline font-mono">
                    {c.username} / {c.password}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
