import React from 'react';
import { Link } from 'react-router-dom';

function SuperAdminLayout({ children }) {
  return (
    <div className="container mx-auto p-4">
      <nav className="mb-4">
        <Link to="/superadmin" className="mr-4 text-blue-500">Dashboard</Link>
        <Link to="/superadmin/inquiries" className="mr-4 text-blue-500">Inquiries</Link>
        <Link to="/superadmin/users" className="mr-4 text-blue-500">Users</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}

export default SuperAdminLayout;