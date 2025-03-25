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
        console.log('Raw templates data:', response.data); // Debug: Check data format
        setTemplates(response.data);
      } catch (err) {
        console.error('Error fetching templates:', err);
      }
    };
    fetchTemplates();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await api.delete(`/bill-templates/${id}`);
        setTemplates(templates.filter(t => t.id !== id));
      } catch (err) {
        console.error('Error deleting template:', err);
      }
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
      navigate(`${basePath}/templates/create`, {
        state: {
          clonedTemplate: response.data,
          newTemplateName: newTemplateName,
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Template List</h2>
        <Link
          to={`${basePath}/templates/create`}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Create New Template
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Template Name</th>
              <th className="py-3 px-4 text-left">Sample Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Mobile</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Items</th>
              <th className="py-3 px-4 text-left">Terms</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {templates.length > 0 ? (
              templates.map(template => (
                <tr key={template.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-4">{template.template_name}</td>
                  <td className="py-4 px-4">{template.name}</td>
                  <td className="py-4 px-4">{template.email}</td>
                  <td className="py-4 px-4">{template.mobile}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        template.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : template.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {template.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <ul className="list-disc list-inside">
                      {template.items.map(item => (
                        <li key={item.id}>
                          {item.item_name} ({item.quantity} x ${parseFloat(item.price).toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-4">
                    {template.terms_conditions && template.terms_conditions.length > 0 ? (
                      <div className="space-y-2">
                        {template.terms_conditions.map(tc => (
                          <div key={tc.id} className="flex items-start">
                            <input
                              type="checkbox"
                              id={`term-${template.id}-${tc.id}`}
                              checked={selectedTerms[template.id]?.includes(tc.id) || false}
                              onChange={() => handleCheckboxChange(template.id, tc.id)}
                              className="mt-1 mr-2"
                            />
                            <label
                              htmlFor={`term-${template.id}-${tc.id}`}
                              className="text-sm text-gray-600"
                            >
                              {selectedTerms[template.id]?.includes(tc.id)
                                ? tc.content
                                : `${tc.content.substring(0, 20)}...`}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      'No Terms'
                    )}
                  </td>
                  <td className="py-4 px-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Link
                      to={`${basePath}/templates/edit/${template.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs sm:text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleCloneClick(template.id, template.template_name)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs sm:text-sm"
                    >
                      Clone
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                  No templates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
                  onChange={e => setNewTemplateName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCloneModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
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