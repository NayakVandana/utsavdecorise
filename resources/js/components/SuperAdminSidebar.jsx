import React from 'react'; // Add this
import { Link } from 'react-router-dom';

function SuperAdminSidebar() {
    return (
        <div className="w-64 bg-gray-800 text-white h-screen fixed">
            <div className="p-4">
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <nav className="mt-4 space-y-2">
                    <Link to="/admin/dashboard" className="block p-2 hover:bg-gray-700">Dashboard</Link>
                    <Link to="/admin/inquiries" className="block p-2 hover:bg-gray-700">Inquiries</Link>
                    <Link to="/admin/users" className="block p-2 hover:bg-gray-700">Users</Link>
                </nav>
            </div>
        </div>
    );
}

export default SuperAdminSidebar;