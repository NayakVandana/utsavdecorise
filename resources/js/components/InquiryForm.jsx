import React, { useState } from 'react';
import api from '../utils/api';

function InquiryForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
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
      console.error('Inquiry failed:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to submit inquiry');
    }
  };

  return (
    <div className="md:fixed md:bottom-4 md:right-4 bg-white shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-xl p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-96 max-h-[80vh] overflow-y-auto z-40 transform transition-all duration-300">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">✨</span> Let’s Connect
      </h2>

      {/* Status Messages */}
      {error && (
        <p className="text-red-500 bg-red-50 p-2 rounded-md text-sm mb-4 shadow-md animate-fade-in">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 bg-green-50 p-2 rounded-md text-sm mb-4 shadow-md animate-fade-in">
          {success}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div className="relative">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:shadow-lg hover:shadow-md transition-all duration-200 placeholder-gray-400"
            required
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
        </div>

        {/* Email Field */}
        <div className="relative">
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:shadow-lg hover:shadow-md transition-all duration-200 placeholder-gray-400"
            required
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
        </div>

        {/* Phone Field */}
        <div className="relative">
          <input
            type="tel"
            placeholder="Your Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:shadow-lg hover:shadow-md transition-all duration-200 placeholder-gray-400"
            required
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </span>
        </div>

        {/* Message Field */}
        <div className="relative">
          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:shadow-lg hover:shadow-md transition-all duration-200 placeholder-gray-400 resize-none"
            rows="4"
            required
          />
          <span className="absolute inset-y-0 right-3 top-3 flex items-start text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 hover:shadow-lg focus:shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md"
        >
          Send Message
        </button>
      </form>

      {/* Optional Footer */}
      <p className="text-gray-500 text-xs mt-4 text-center">
        We’ll get back to you within 24 hours!
      </p>
    </div>
  );
}

export default InquiryForm;