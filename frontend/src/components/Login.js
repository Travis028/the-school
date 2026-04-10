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
      <div className="hidden lg:flex lg:w-5/12 bg-blue-900 flex-col justify-between p-12">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-white flex items-center justify-center font-black text-blue-900 text-base">A</div>
            <div>
              <p className="font-black text-white text-sm leading-none">Akilli School</p>
              <p className="text-blue-300 text-xs">Nairobi, Kenya</p>
            </div>
          </Link>
          <h2 className="text-3xl font-black text-white leading-tight mb-4">
            Welcome back to the Akilli School Portal
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Log in to access your personalised dashboard. Students can view grades and attendance. Teachers can manage classes and records. Administrators have full system access.
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

          <h1 className="text-2xl font-black text-gray-900 mb-1">Sign In</h1>
          <p className="text-gray-500 text-sm mb-8">Enter your username and password to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                required
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-800 font-medium transition">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-800 text-white py-3 text-sm font-bold hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign In'}
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
        </div>
      </div>
    </div>
  );
};

export default Login;
