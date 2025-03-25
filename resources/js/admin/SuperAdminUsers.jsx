import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Ensure this path is correct

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        console.log('Users response:', response.data); // Debug: Check data format
        setUsers(response.data.data || []); // Default to empty array if no data
      } catch (error) {
        console.error('Failed to fetch users:', error.response?.data || error.message);
        setError(error.response?.data?.message || error.message || 'Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Users</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
            <tr>
              <th className="py-3 px-6 text-left font-semibold w-1/3">Name</th>
              <th className="py-3 px-6 text-left font-semibold w-1/3">Email</th>
              <th className="py-3 px-6 text-center font-semibold w-1/3">Role</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-left align-middle w-1/3 truncate">{user.name || 'N/A'}</td>
                  <td className="py-4 px-6 text-left align-middle w-1/3 truncate">{user.email || 'N/A'}</td>
                  <td className="py-4 px-6 text-center align-middle w-1/3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.is_admin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 px-6 text-center text-gray-500 align-middle">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SuperAdminUsers;