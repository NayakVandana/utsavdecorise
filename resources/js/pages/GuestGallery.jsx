import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function GuestGallery() {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const url = filter ? `/gallery?category=${filter}` : '/gallery';
        const response = await api.get(url);
        console.log('Gallery response:', response.data);
        setPhotos(response.data.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch photos:', error.message || error);
        setError(error.response?.data?.message || 'Failed to load gallery');
      }
    };
    fetchPhotos();
  }, [filter]);

  const categories = ['Management', 'Marriage', 'Birthday'];

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Our Gallery</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded ${!filter ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 hover:text-white`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded ${filter === cat ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 hover:text-white`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {photos.length === 0 && !error ? (
        <p className="text-center text-gray-500">No photos available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {photo.path ? (
                <img
                  src={photo.path} // e.g., /photos/...
                  alt={photo.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => console.error('Image load failed:', photo.path)}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="p-3">
                <h3 className="text-lg font-semibold">{photo.title}</h3>
                <p className="text-sm text-gray-600">{photo.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GuestGallery;