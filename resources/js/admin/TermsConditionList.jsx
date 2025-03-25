import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const TermsConditionList = ({ token, user }) => {
  const [termsConditions, setTermsConditions] = useState([]);
  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';

  useEffect(() => {
    const fetchTermsConditions = async () => {
      try {
        const response = await api.get('/terms-conditions');
        console.log('Raw terms data:', response.data); // Debug: Check data format
        setTermsConditions(response.data);
      } catch (err) {
        console.error('Error fetching terms and conditions:', err);
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
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Terms and Conditions List</h2>
        <Link
          to={`${basePath}/terms-conditions/create`}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Create New Terms
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Content</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {termsConditions.length > 0 ? (
              termsConditions.map(tc => (
                <tr key={tc.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-4">{tc.id}</td>
                  <td className="py-4 px-4">
                    {tc.content.length > 100 ? `${tc.content.substring(0, 100)}...` : tc.content}
                  </td>
                  <td className="py-4 px-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Link
                      to={`${basePath}/terms-conditions/edit/${tc.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs sm:text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(tc.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                  No terms and conditions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TermsConditionList;