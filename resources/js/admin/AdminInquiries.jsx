import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await api.get('/admin/inquiries');
        console.log('Inquiries response:', response.data); // Debug: Check data format
        setInquiries(response.data.data || []); // Default to empty array if no data
      } catch (error) {
        console.error('Failed to fetch inquiries:', error.response?.data);
        setError(error.response?.data?.message || 'Failed to load inquiries');
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Admin Inquiries</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {inquiries.length > 0 ? (
              inquiries.map(inquiry => (
                <tr key={inquiry.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-4">{inquiry.id}</td>
                  <td className="py-4 px-4">{inquiry.name}</td>
                  <td className="py-4 px-4">{inquiry.email}</td>
                  <td className="py-4 px-4 max-w-xs truncate">
                    {inquiry.message.length > 50 ? `${inquiry.message.substring(0, 50)}...` : inquiry.message}
                  </td>
                  <td className="py-4 px-4">
                    {inquiry.created_at ? new Date(inquiry.created_at).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                  No inquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminInquiries;