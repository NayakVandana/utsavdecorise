import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import GuestGallery from './pages/GuestGallery';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminInquiries from './admin/AdminInquiries';
import AdminPhotos from './admin/AdminPhotos';
import SuperAdminLayout from './admin/SuperAdminLayout';
import SuperAdminUsers from './admin/SuperAdminUsers';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

  const isAuthenticated = !!token;
  const isAdmin = user && user.is_admin === 1;
  const isSuperAdmin = user && user.is_admin === 2;

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header token={token} setToken={setToken} setUser={setUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<GuestGallery />} />
            <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
            <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
            <Route
              path="/admin/*"
              element={
                isAuthenticated && isAdmin ? (
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/inquiries" element={<AdminInquiries />} />
                      <Route path="/photos" element={<AdminPhotos />} />
                    </Routes>
                  </AdminLayout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/superadmin/*"
              element={
                isAuthenticated && isSuperAdmin ? (
                  <SuperAdminLayout>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/inquiries" element={<AdminInquiries />} />
                      <Route path="/users" element={<SuperAdminUsers />} />
                      <Route path="/photos" element={<AdminPhotos />} />
                    </Routes>
                  </SuperAdminLayout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;