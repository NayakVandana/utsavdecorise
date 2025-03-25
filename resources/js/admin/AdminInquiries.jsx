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
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Admin Inquiries</h1>
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
              <th className="py-3 px-6 text-center font-semibold w-1/12">ID</th>
              <th className="py-3 px-6 text-left font-semibold w-2/12">Name</th>
              <th className="py-3 px-6 text-left font-semibold w-2/12">Email</th>
              <th className="py-3 px-6 text-left font-semibold w-4/12">Message</th>
              <th className="py-3 px-6 text-center font-semibold w-3/12">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {inquiries.length > 0 ? (
              inquiries.map(inquiry => (
                <tr key={inquiry.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-center align-middle w-1/12">{inquiry.id || 'N/A'}</td>
                  <td className="py-4 px-6 text-left align-middle w-2/12 truncate">{inquiry.name || 'N/A'}</td>
                  <td className="py-4 px-6 text-left align-middle w-2/12 truncate">{inquiry.email || 'N/A'}</td>
                  <td className="py-4 px-6 text-left align-middle w-4/12 truncate">
                    {inquiry.message
                      ? inquiry.message.length > 50
                        ? `${inquiry.message.substring(0, 50)}...`
                        : inquiry.message
                      : 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-center align-middle w-3/12">
                    {inquiry.created_at ? new Date(inquiry.created_at).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 px-6 text-center text-gray-500 align-middle">
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