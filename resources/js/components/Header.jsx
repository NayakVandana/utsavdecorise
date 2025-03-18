import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header({ token, setToken, setUser }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-indigo-600 text-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl sm:text-2xl font-bold">Utsav Decorise</Link>
        <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'} />
          </svg>
        </button>
        <nav className={`${isOpen ? 'block' : 'hidden'} md:block absolute md:static top-full left-0 w-full md:w-auto bg-indigo-600 md:bg-transparent md:flex md:items-center md:space-x-4 transition-all duration-300 ease-in-out`}>
          <div className="flex flex-col md:flex-row md:space-x-4 p-4 md:p-0">
            <Link to="/" className="py-2 md:py-0 hover:text-gray-200 transition block text-sm sm:text-base" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/services" className="py-2 md:py-0 hover:text-gray-200 transition block text-sm sm:text-base" onClick={() => setIsOpen(false)}>Services</Link>
            <Link to="/about" className="py-2 md:py-0 hover:text-gray-200 transition block text-sm sm:text-base" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" className="py-2 md:py-0 hover:text-gray-200 transition block text-sm sm:text-base" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link to="/gallery" className="py-2 md:py-0 hover:text-gray-200 transition block text-sm sm:text-base" onClick={() => setIsOpen(false)}>Gallery</Link>
            {token ? (
              <>
                <Link
                  to={localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).is_admin === 2 ? '/superadmin' : '/admin'}
                  className="py-2 md:py-0 hover:text-gray-200 transition block text-sm sm:text-base"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="py-2 md:py-0 hover:text-gray-200 transition block text-left text-sm sm:text-base">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 md:py-0 hover:text-gray-200 transition block text-sm sm:text-base" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="py-2 md:py-0 hover:text-gray-200 transition block text-sm sm:text-base" onClick={() => setIsOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;