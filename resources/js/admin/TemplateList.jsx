import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; // Add Link and useLocation
import api from '../utils/api';

const TemplateList = ({ token, user }) => { // Add user prop
  const [templates, setTemplates] = useState([]);
  const location = useLocation(); // Get current location

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/bill-templates');
        setTemplates(response.data);
      } catch (err) {
        console.error('Error fetching templates:', err);
      }
    };
    fetchTemplates();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bill-templates/${id}`);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  // Determine base path based on user role or current location
  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
  // Alternatively, infer from location: const basePath = location.pathname.startsWith('/superadmin') ? '/superadmin' : '/admin';

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800">Template List</h2>
      <Link to={`${basePath}/templates/create`} className="bg-green-500 text-white p-2 rounded mb-4 inline-block">
        Create New Template
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map(template => (
          <div key={template.id} className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-800">{template.template_name}</h3>
            <p className="text-sm text-gray-600">Name: {template.name}</p>
            <p className="text-sm text-gray-600">Email: {template.email}</p>
            <p className="text-sm text-gray-600">Mobile: {template.mobile}</p>
            <p className="text-sm text-gray-600">Address: {template.address}</p>
            <p className="text-sm text-gray-600">Invoice: {template.invoice_number}</p>
            <p className="text-sm text-gray-600">Total: ${template.total_amount}</p>
            <ul className="mt-2">
              {template.items.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  {item.item_name} - {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>
            <Link
              to={`${basePath}/templates/edit/${template.id}`}
              className="mt-2 bg-blue-500 text-white p-2 rounded w-full block text-center"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(template.id)}
              className="mt-2 bg-red-500 text-white p-2 rounded w-full"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateList;