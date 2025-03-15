import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Ensure this path is correct

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null); // Define error state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        console.log('Users response:', response.data);
        setUsers(response.data.data);
      } catch (error) {
        console.error('Failed to fetch users:', error.message || error); // Log full error
        setError(error.response?.data?.message || error.message || 'Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.is_admin ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SuperAdminUsers;