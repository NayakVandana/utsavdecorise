import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TemplateList = ({ token, user }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState({});
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [cloneTemplateId, setCloneTemplateId] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/bill-templates');
        console.log('Raw templates data:', response.data); // Debug: Check data format
        setTemplates(response.data || []);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError(err.response?.data?.message || 'Failed to load templates. Please try again.');
      } finally {
        setLoading(false);
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
        setError('Failed to delete template. Please try again.');
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

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Template List</h2>
        <Link
          to={`${basePath}/templates/create`}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base font-semibold"
        >
          Create New Template
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Templates Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
              <tr>
                <th className="py-3 px-6 text-left font-semibold w-1/12">Template Name</th>
                <th className="py-3 px-6 text-left font-semibold w-1/12">Sample Name</th>
                <th className="py-3 px-6 text-left font-semibold w-1/12">Email</th>
                <th className="py-3 px-6 text-left font-semibold w-1/12">Mobile</th>
                <th className="py-3 px-6 text-center font-semibold w-1/12">Status</th>
                <th className="py-3 px-6 text-left font-semibold w-2/12">Items</th>
                <th className="py-3 px-6 text-left font-semibold w-2/12">Terms</th>
                <th className="py-3 px-6 text-center font-semibold w-2/12">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {templates.length > 0 ? (
                templates.map(template => (
                  <tr key={template.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6 text-left align-middle w-1/12 truncate">
                      {template.template_name || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-left align-middle w-1/12 truncate">
                      {template.name || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-left align-middle w-1/12 truncate">
                      {template.email || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-left align-middle w-1/12 truncate">
                      {template.mobile || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-center align-middle w-1/12">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          template.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : template.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : template.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {template.status ? template.status.charAt(0).toUpperCase() + template.status.slice(1) : 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-left align-middle w-2/12">
                      {template.items && template.items.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {template.items.map(item => (
                            <li key={item.id} className="text-sm truncate">
                              {item.item_name} ({item.quantity} x ${parseFloat(item.price).toFixed(2)})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">No Items</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-left align-middle w-2/12">
                      {template.terms_conditions && template.terms_conditions.length > 0 ? (
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {template.terms_conditions.map(tc => (
                            <div key={tc.id} className="flex items-start">
                              <input
                                type="checkbox"
                                id={`term-${template.id}-${tc.id}`}
                                checked={selectedTerms[template.id]?.includes(tc.id) || false}
                                onChange={() => handleCheckboxChange(template.id, tc.id)}
                                className="mt-1 mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`term-${template.id}-${tc.id}`}
                                className="text-sm text-gray-600 truncate"
                              >
                                {selectedTerms[template.id]?.includes(tc.id)
                                  ? tc.content
                                  : tc.content.length > 20
                                  ? `${tc.content.substring(0, 20)}...`
                                  : tc.content}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No Terms</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center align-middle w-2/12">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                        <Link
                          to={`${basePath}/templates/edit/${template.id}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs sm:text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs sm:text-sm font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleCloneClick(template.id, template.template_name)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-xs sm:text-sm font-medium"
                        >
                          Clone
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 px-6 text-center text-gray-500 align-middle">
                    No templates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clone Modal */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Clone Template</h3>
            <form onSubmit={handleCloneSubmit} className="space-y-4">
              <div>
                <label htmlFor="template_name" className="block text-sm font-medium text-gray-700 mb-1">
                  New Template Name
                </label>
                <input
                  type="text"
                  id="template_name"
                  value={newTemplateName}
                  onChange={e => setNewTemplateName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCloneModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-semibold"
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