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
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800">Terms and Conditions List</h2>
      <Link to={`${basePath}/terms-conditions/create`} className="bg-green-500 text-white p-2 rounded mb-4 inline-block">
        Create New Terms
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {termsConditions.map(tc => (
          <div key={tc.id} className="bg-white p-4 rounded-2xl shadow-lg">
            <p className="text-sm text-gray-600">{tc.content.substring(0, 100)}...</p>
            <div className="mt-2 space-x-2">
              <Link
                to={`${basePath}/terms-conditions/edit/${tc.id}`}
                className="bg-blue-500 text-white p-2 rounded inline-block"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(tc.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsConditionList;