import React from 'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    <nav className="bg-gray-800 text-white p-4 pt-20">
      <ul className="flex space-x-4">
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/inquiries">Inquiries</Link></li>
        <li><Link to="/admin/photos">Photos</Link></li>
        <li><Link to="/admin/bills">Bills</Link></li>
        <li><Link to="/admin/templates">Templates</Link></li>
      </ul>
    </nav>
    <div className="p-4">{children}</div>
  </div>
);

export default AdminLayout;