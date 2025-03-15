import React, { useState } from 'react';
import api from '../utils/api';

function InquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post('/inquiry', formData);
      console.log('Inquiry response:', response.data);
      setSuccess('Inquiry submitted successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Inquiry submission failed:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to submit inquiry');
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Inquire Now</h2>
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
}

export default InquiryForm;