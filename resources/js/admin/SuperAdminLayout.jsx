import React from 'react';
import { Link } from 'react-router-dom';

const SuperAdminLayout = ({ children }) => (
  <div className="superadmin-layout flex min-h-screen flex-col">
    {/* Space for Header */}
    <div className="h-16" /> {/* Matches header height (py-4 = 16px padding + content) */}

    {/* Main Layout */}
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="bg-gray-900 text-white w-64 flex-shrink-0 fixed top-16 left-0 h-[calc(100vh-4rem)]">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Super Admin</h1>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/superadmin"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/superadmin/inquiries"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Inquiries
                </Link>
              </li>
              <li>
                <Link
                  to="/superadmin/users"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  to="/superadmin/photos"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Photos
                </Link>
              </li>
              <li>
                <Link
                  to="/superadmin/bills"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Bills
                </Link>
              </li>
              <li>
                <Link
                  to="/superadmin/templates"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/superadmin/terms-conditions"
                  className="block py-2 px-4 rounded hover:bg-gray-700 hover:text-gray-300 transition duration-200"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/superadmin/all-payments"
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

export default SuperAdminLayout;