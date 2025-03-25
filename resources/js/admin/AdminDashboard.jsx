import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    totalBills: 0,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Replace these with actual API endpoints to fetch stats
        const usersResponse = await api.get('/admin/users');
        const paymentsResponse = await api.get('/all-payments');
        const billsResponse = await api.get('/admin/bills'); // Adjust endpoint as needed

        setStats({
          totalUsers: usersResponse.data.data?.length || 0,
          totalPayments: paymentsResponse.data?.length || 0,
          totalBills: billsResponse.data?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard stats');
      }
    };
    fetchStats();
  }, []);

  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Welcome Message */}
      <div className="mb-8">
        <p className="text-lg text-gray-600">
          Welcome to the admin panel, {user?.name || 'Admin'}.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Users Card */}
        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate(`${basePath}/users`)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          <p className="text-sm text-gray-500 mt-2">Click to view all users</p>
        </div>

        {/* Total Payments Card */}
        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate(`${basePath}/all-payments`)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Payments</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalPayments}</p>
          <p className="text-sm text-gray-500 mt-2">Click to view all payments</p>
        </div>

        {/* Total Bills Card */}
        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate(`${basePath}/bills`)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Bills</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalBills}</p>
          <p className="text-sm text-gray-500 mt-2">Click to view all bills</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate(`${basePath}/users`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate(`${basePath}/all-payments`)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base"
          >
            View Payments
          </button>
          <button
            onClick={() => navigate(`${basePath}/bills`)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm sm:text-base"
          >
            Manage Bills
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;