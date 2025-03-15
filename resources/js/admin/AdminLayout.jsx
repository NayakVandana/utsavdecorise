import React from 'react';
import { Link } from 'react-router-dom';

function AdminLayout({ children }) {
  return (
    <div className="container mx-auto p-4">
      <nav className="mb-4">
        <Link to="/admin" className="mr-4 text-blue-500">Dashboard</Link>
        <Link to="/admin/inquiries" className="mr-4 text-blue-500">Inquiries</Link>
        <Link to="/admin/photos" className="mr-4 text-blue-500">Photos</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}

export default AdminLayout;