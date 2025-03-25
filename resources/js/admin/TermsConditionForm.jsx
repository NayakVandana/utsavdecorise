import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const TermsConditionForm = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ content: '' });
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    if (id) {
      const fetchTermsCondition = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await api.get(`/terms-conditions/${id}`);
          setForm({ content: response.data.content || '' });
        } catch (err) {
          console.error('Error fetching terms and condition:', err);
          setError(err.response?.data?.message || 'Failed to load terms and conditions. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchTermsCondition();
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (id) {
        await api.put(`/terms-conditions/${id}`, form);
      } else {
        await api.post('/terms-conditions', form);
      }
      const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
      navigate(`${basePath}/terms-conditions`);
    } catch (err) {
      console.error('Error saving terms:', err);
      setError(err.response?.data?.message || 'Failed to save terms and conditions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleBack = () => {
    const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
    navigate(`${basePath}/terms-conditions`);
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
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          {id ? 'Edit Terms and Conditions' : 'Create Terms and Conditions'}
        </h2>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
        >
          Back
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Terms and Conditions
            </label>
            <textarea
              name="content"
              id="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Enter terms and conditions"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-40 resize-y"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg transition text-sm sm:text-base font-semibold ${
              loading ? 'bg-green-300 text-gray-100 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update' : 'Create')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TermsConditionForm;