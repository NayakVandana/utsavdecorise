import React from 'react';
import { Link } from 'react-router-dom';

const SuperAdminLayout = ({ children }) => (
  <div className="superadmin-layout">
    <nav className="bg-gray-900 text-white p-4 pt-20">
      <ul className="flex space-x-4">
        <li><Link to="/superadmin">Dashboard</Link></li>
        <li><Link to="/superadmin/inquiries">Inquiries</Link></li>
        <li><Link to="/superadmin/users">Users</Link></li>
        <li><Link to="/superadmin/photos">Photos</Link></li>
        <li><Link to="/superadmin/bills">Bills</Link></li>
        <li><Link to="/superadmin/templates">Templates</Link></li>
        <li><Link to="/superadmin/terms-conditions">Terms</Link></li>
      </ul>
    </nav>
    <div className="p-4">{children}</div>
  </div>
);

export default SuperAdminLayout;