import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TemplateList = ({ token, user }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState({});
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [cloneTemplateId, setCloneTemplateId] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const navigate = useNavigate();

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

  const handleCloneClick = (id, currentName) => {
    setCloneTemplateId(id);
    setNewTemplateName(`${currentName} (Clone)`);
    setShowCloneModal(true);
  };

  const handleCloneSubmit = async (e) => {
    e.preventDefault();
    if (!newTemplateName.trim()) {
      alert('Template name is required');
      return;
    }

    try {
      const response = await api.post(`/bill-templates/clone/${cloneTemplateId}`, {
        template_name: newTemplateName,
      });
      console.log('Template cloned:', response.data);
      setShowCloneModal(false);
      setNewTemplateName('');
      setCloneTemplateId(null);

      const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
      // Pass both the entered name and cloned data
      navigate(`${basePath}/templates/create`, {
        state: {
          clonedTemplate: response.data,
          newTemplateName: newTemplateName, // Preserve the entered name
        },
      });
    } catch (err) {
      console.error('Error cloning template:', err);
      alert('Failed to clone template');
    }
  };

  const handleCheckboxChange = (templateId, termId) => {
    setSelectedTerms(prev => {
      const templateTerms = prev[templateId] || [];
      if (templateTerms.includes(termId)) {
        return { ...prev, [templateId]: templateTerms.filter(id => id !== termId) };
      } else {
        return { ...prev, [templateId]: [...templateTerms, termId] };
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
              <button
                onClick={() => handleCloneClick(template.id, template.template_name)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Clone
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Clone Modal */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Clone Template</h3>
            <form onSubmit={handleCloneSubmit}>
              <div className="mb-4">
                <label htmlFor="template_name" className="block text-sm font-medium text-gray-700">
                  New Template Name
                </label>
                <input
                  type="text"
                  id="template_name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCloneModal(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                >
                  Clone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateList;