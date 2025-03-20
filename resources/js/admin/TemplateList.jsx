import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const TemplateList = ({ token, user }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState({}); // Tracks selected terms for each template

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

  const handleCheckboxChange = (templateId, termId) => {
    setSelectedTerms(prev => {
      const templateTerms = prev[templateId] || [];
      if (templateTerms.includes(termId)) {
        return {
          ...prev,
          [templateId]: templateTerms.filter(id => id !== termId),
        };
      } else {
        return {
          ...prev,
          [templateId]: [...templateTerms, termId],
        };
      }
    });
  };

  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800">Template List</h2>
      <Link to={`${basePath}/templates/create`} className="bg-green-500 text-white p-2 rounded mb-4 inline-block">
        Create New Template
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {templates.map(template => (
          <div key={template.id} className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-800">{template.template_name}</h3>
            <p className="text-sm text-gray-600">Sample Name: {template.name}</p>
            <p className="text-sm text-gray-600">Email: {template.email}</p>
            <p className="text-sm text-gray-600">Mobile: {template.mobile}</p>
            <p className="text-sm text-gray-600">Status: {template.status}</p>
            <ul className="mt-2">
              {template.items.map(item => (
                <li key={item.id} className="text-sm text-gray-600">
                  {item.item_name} - {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>
            {template.terms_conditions && template.terms_conditions.length > 0 && (
              <div className="mt-2">
                <strong className="text-sm text-gray-600">Terms:</strong>
                <div className="mt-1 space-y-2">
                  {template.terms_conditions.map(tc => (
                    <div key={tc.id} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`term-${template.id}-${tc.id}`}
                        checked={selectedTerms[template.id]?.includes(tc.id) || false}
                        onChange={() => handleCheckboxChange(template.id, tc.id)}
                        className="mt-1 mr-2"
                      />
                      <label htmlFor={`term-${template.id}-${tc.id}`} className="text-sm text-gray-600">
                        {selectedTerms[template.id]?.includes(tc.id) ? tc.content : `${tc.content.substring(0, 20)}...`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2 space-x-2">
              <Link
                to={`${basePath}/templates/edit/${template.id}`}
                className="bg-blue-500 text-white p-2 rounded inline-block"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(template.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateList;