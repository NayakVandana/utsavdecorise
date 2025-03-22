import React from 'react';
import { Link } from 'react-router-dom';

const SuperAdminLayout = ({ children }) => (
  <div className="superadmin-layout">
    <nav className="bg-gray-900 text-white p-4 pt-20">
      <ul className="flex space-x-4">
        <li><Link to="/superadmin" className="hover:text-gray-300">Dashboard</Link></li>
        <li><Link to="/superadmin/inquiries" className="hover:text-gray-300">Inquiries</Link></li>
        <li><Link to="/superadmin/users" className="hover:text-gray-300">Users</Link></li>
        <li><Link to="/superadmin/photos" className="hover:text-gray-300">Photos</Link></li>
        <li><Link to="/superadmin/bills" className="hover:text-gray-300">Bills</Link></li>
        <li><Link to="/superadmin/templates" className="hover:text-gray-300">Templates</Link></li>
        <li><Link to="/superadmin/terms-conditions" className="hover:text-gray-300">Terms</Link></li>
        <li><Link to="/superadmin/all-payments" className="hover:text-gray-300">Receive Payments</Link></li> 
      </ul>
    </nav>
    <div className="p-4">{children}</div>
  </div>
);

export default SuperAdminLayout;