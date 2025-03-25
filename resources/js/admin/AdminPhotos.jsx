import React, { useState } from 'react';
import api from '../utils/api';

function AdminPhotos() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Management',
    image: null,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('image', formData.image);

    try {
      const response = await api.post('/admin/photos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload response:', response.data);
      setSuccess('Photo uploaded successfully!');
      setFormData({ title: '', category: 'Management', image: null });
      // Reset file input
      document.getElementById('image-input').value = null;
    } catch (error) {
      console.error('Upload failed:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to upload photo');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Upload Photo</h1>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter photo title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="Management">Management</option>
              <option value="Marriage">Marriage</option>
              <option value="Birthday">Birthday</option>
            </select>
          </div>

          {/* Image Input */}
          <div>
            <label htmlFor="image-input" className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              id="image-input"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base font-semibold"
          >
            Upload Photo
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPhotos;