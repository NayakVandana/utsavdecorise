import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Login({ setToken, setUser }) {
  const [formData, setFormData] = useState({ email: '', password: '', login_type: 'web' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', formData);
      const { token, user } = response.data;
      console.log('Login response:', response.data);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Ensure user is stringified
      setToken(token);
      setUser(user);
       // Immediate redirect based on is_admin
       if (user.is_admin === 2) {
        console.log('Redirecting to /superadmin');
        navigate('/superadmin');
      } else if (user.is_admin === 1) {
        console.log('Redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('Redirecting to /');
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;