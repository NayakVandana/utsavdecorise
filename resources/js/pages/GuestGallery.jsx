import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import InquiryForm from '../components/InquiryForm';

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
    <div className="container mx-auto p-4 pt-20 min-h-screen">
     
        {/* Main Content */}
        <div className="flex items-center flex-col gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Our Gallery</h1>
          {error && <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilter('')}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded ${!filter ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 hover:text-white transition text-sm sm:text-base`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded ${filter === cat ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-600 hover:text-white transition text-sm sm:text-base`}
              >
                {cat}
              </button>
            ))}
          </div>
          {photos.length === 0 && !error ? (
            <p className="text-gray-500 text-sm sm:text-base">No photos available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  {photo.path ? (
                    <img
                      src={photo.path}
                      alt={photo.title}
                      className="w-full h-32 sm:h-48 object-cover"
                      onError={(e) => console.error('Image load failed:', photo.path)}
                    />
                  ) : (
                    <div className="w-full h-32 sm:h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm sm:text-base">No Image</span>
                    </div>
                  )}
                  <div className="p-2 sm:p-3">
                    <h3 className="text-sm sm:text-lg font-semibold">{photo.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{photo.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inquiry Form */}
        <InquiryForm />
      
    </div>
  );
}

export default GuestGallery;