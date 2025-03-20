import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const TermsConditionForm = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ content: '' });
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    if (id) {
      const fetchTermsCondition = async () => {
        try {
          const response = await api.get(`/terms-conditions/${id}`);
          setForm({ content: response.data.content });
        } catch (err) {
          console.error('Error fetching terms and condition:', err);
        }
      };
      fetchTermsCondition();
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBack = () => {
    const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
    navigate(`${basePath}/terms-conditions`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          {id ? 'Edit Terms and Conditions' : 'Create Terms and Conditions'}
        </h2>
        <button onClick={handleBack} className="bg-gray-500 text-white p-2 rounded">Back</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-2xl shadow-lg">
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Enter Terms and Conditions"
          className="w-full p-2 border rounded h-40"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
          {id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default TermsConditionForm;