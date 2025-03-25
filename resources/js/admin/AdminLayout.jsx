import React from 'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => (
  <div className="admin-layout flex min-h-screen flex-col">
    {/* Space for Header */}
    <div className="h-16" />

    {/* Main Layout */}
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="bg-gray-800 text-white w-64 flex-shrink-0 fixed top-16 left-0 h-[calc(100vh-4rem)]">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Admin</h1>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/admin"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/inquiries"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Inquiries
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/photos"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Photos
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/bills"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Bills
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/templates"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/terms-conditions"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/all-payments"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Receive Payments
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-64">
        {children}
      </main>
    </div>
  </div>
);

export default AdminLayout;