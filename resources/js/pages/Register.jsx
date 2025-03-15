import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Register({ setToken, setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    login_type: 'web',
    is_admin: 0 // Default to regular user
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post('/register', formData);
      const { token, user } = response.data;
      console.log('Registration response:', response.data); // Debug full response
      console.log('User is_admin:', user.is_admin); // Debug is_admin

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update parent state
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
      console.error('Registration failed:', error.response?.data);
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
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
        {/* Role selection for testing */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="role"
              value={0}
              checked={formData.is_admin === 0}
              onChange={() => setFormData({ ...formData, is_admin: 0 })}
              className="form-radio"
            />
            <span>User</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="role"
              value={1}
              checked={formData.is_admin === 1}
              onChange={() => setFormData({ ...formData, is_admin: 1 })}
              className="form-radio"
            />
            <span>Admin</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="role"
              value={2}
              checked={formData.is_admin === 2}
              onChange={() => setFormData({ ...formData, is_admin: 2 })}
              className="form-radio"
            />
            <span>Super Admin</span>
          </label>
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;