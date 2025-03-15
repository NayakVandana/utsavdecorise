import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Header({ token, setToken, setUser }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Get user from localStorage

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data);
    }
  };

  // Determine dashboard path based on is_admin
  const dashboardPath = user.is_admin === 2 ? '/superadmin' : '/admin';

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Utsav Decorise</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/services" className="hover:text-gray-300">Services</Link>
          <Link to="/gallery" className="hover:text-gray-300">Gallery</Link> {/* Add this */}
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact</Link>
          {token ? (
            <>
              <Link to={dashboardPath} className="hover:text-gray-300">Dashboard</Link>
              <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;