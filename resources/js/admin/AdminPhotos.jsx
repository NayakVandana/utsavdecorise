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
    } catch (error) {
      console.error('Upload failed:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to upload photo');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Photo</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="Management">Management</option>
          <option value="Marriage">Marriage</option>
          <option value="Birthday">Birthday</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Upload
        </button>
      </form>
    </div>
  );
}

export default AdminPhotos;