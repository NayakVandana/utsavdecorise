import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ isSuperAdmin }) {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed">
      <div className="p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-4">
        <Link to="/admin" className="block p-4 hover:bg-gray-700">Dashboard</Link>
        <Link to="/admin/inquiries" className="block p-4 hover:bg-gray-700">Inquiries</Link>
        {isSuperAdmin && (
          <Link to="/superadmin/users" className="block p-4 hover:bg-gray-700">Users</Link>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;