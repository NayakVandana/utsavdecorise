import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const TermsConditionList = ({ token, user }) => {
  const [termsConditions, setTermsConditions] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';

  useEffect(() => {
    const fetchTermsConditions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/terms-conditions');
        console.log('Raw terms data:', response.data); // Debug: Check data format
        setTermsConditions(response.data || []);
      } catch (err) {
        console.error('Error fetching terms and conditions:', err);
        setError(err.response?.data?.message || 'Failed to load terms and conditions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTermsConditions();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this term?')) {
      try {
        await api.delete(`/terms-conditions/${id}`);
        setTermsConditions(termsConditions.filter(tc => tc.id !== id));
      } catch (err) {
        console.error('Error deleting terms and condition:', err);
        setError('Failed to delete term. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Terms and Conditions List</h2>
        <Link
          to={`${basePath}/terms-conditions/create`}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base font-semibold"
        >
          Create New Terms
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Terms and Conditions Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
              <tr>
                <th className="py-3 px-6 text-left font-semibold w-1/12">ID</th>
                <th className="py-3 px-6 text-left font-semibold w-8/12">Content</th>
                <th className="py-3 px-6 text-center font-semibold w-3/12">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {termsConditions.length > 0 ? (
                termsConditions.map(tc => (
                  <tr key={tc.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6 text-left align-middle w-1/12">{tc.id}</td>
                    <td className="py-4 px-6 text-left align-middle w-8/12">
                      {tc.content.length > 100 ? `${tc.content.substring(0, 100)}...` : tc.content}
                    </td>
                    <td className="py-4 px-6 text-center align-middle w-3/12">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                        <Link
                          to={`${basePath}/terms-conditions/edit/${tc.id}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs sm:text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(tc.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs sm:text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 px-6 text-center text-gray-500 align-middle">
                    No terms and conditions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionList;