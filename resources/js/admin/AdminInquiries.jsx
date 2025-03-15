import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await api.get('/admin/inquiries');
        console.log('Inquiries response:', response.data);
        setInquiries(response.data.data);
      } catch (error) {
        console.error('Failed to fetch inquiries:', error.response?.data);
        setError(error.response?.data?.message || 'Failed to load inquiries');
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Inquiries</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul>
        {inquiries.map((inquiry) => (
          <li key={inquiry.id} className="border-b py-2">
            {inquiry.name} - {inquiry.email} - {inquiry.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminInquiries;