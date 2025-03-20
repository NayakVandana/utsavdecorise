import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TemplateCreate = ({ token }) => {
  const [form, setForm] = useState({
    template_name: '',
    name: '',
    email: '',
    mobile: '',
    address: '',
    invoice_number: '',
    issue_date: '',
    due_date: '',
    status: 'pending',
    items: [{ item_name: '', quantity: 1, price: 0 }],
    notes: '',
    terms_condition_ids: [],
  });
  const [preview, setPreview] = useState(form);
  const [termsConditions, setTermsConditions] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTermsConditions = async () => {
      try {
        const response = await api.get('/terms-conditions');
        setTermsConditions(response.data);
      } catch (err) {
        console.error('Error fetching terms and conditions:', err);
      }
    };
    fetchTermsConditions();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      items: JSON.stringify(form.items), // Convert items to JSON string
      terms_condition_ids: form.terms_condition_ids, // Keep as array
    };

    try {
      await api.post('/bill-templates', payload);
      const resetForm = {
        template_name: '', name: '', email: '', mobile: '', address: '',
        invoice_number: '', issue_date: '', due_date: '', status: 'pending',
        items: [{ item_name: '', quantity: 1, price: 0 }], notes: '',
        terms_condition_ids: [],
      };
      setForm(resetForm);
      setPreview(resetForm);
      setErrors({});
      const user = JSON.parse(localStorage.getItem('user'));
      const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
      navigate(`${basePath}/templates`);
    } catch (err) {
      console.error('Error creating template:', err);
      if (err.response && err.response.data) {
        setErrors(err.response.data.errors || { general: [err.response.data.message || 'An error occurred'] });
      }
    }
  };

  const addItem = () => {
    const newItems = [...form.items, { item_name: '', quantity: 1, price: 0 }];
    setForm({ ...form, items: newItems });
    setPreview({ ...form, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setForm({ ...form, items: newItems });
    setPreview({ ...form, items: newItems });
  };

  const handleInputChange = (field, value) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    setPreview(updatedForm);
  };

  const handleTermsChange = (termId) => {
    const updatedIds = form.terms_condition_ids.includes(termId)
      ? form.terms_condition_ids.filter(id => id !== termId)
      : [...form.terms_condition_ids, termId];
    setForm({ ...form, terms_condition_ids: updatedIds });
    setPreview({ ...form, terms_condition_ids: updatedIds });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2);
  };

  const handleBack = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
    navigate(`${basePath}/templates`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Create Template</h2>
        <button onClick={handleBack} className="bg-gray-500 text-white p-2 rounded">Back</button>
      </div>
      {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general[0]}</p>}
      <div className="flex flex-col md:flex-row gap-6">
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-4 bg-white p-4 rounded-2xl shadow-lg">
          <input type="text" placeholder="Template Name" value={form.template_name} onChange={(e) => handleInputChange('template_name', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.template_name && <p className="text-red-500 text-sm">{errors.template_name[0]}</p>}
          <input type="text" placeholder="Sample Name" value={form.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
          <input type="email" placeholder="Sample Email" value={form.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
          <input type="text" placeholder="Sample Mobile" value={form.mobile} onChange={(e) => handleInputChange('mobile', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile[0]}</p>}
          <textarea placeholder="Sample Address" value={form.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.address && <p className="text-red-500 text-sm">{errors.address[0]}</p>}
          <input type="text" placeholder="Sample Invoice Number" value={form.invoice_number} onChange={(e) => handleInputChange('invoice_number', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.invoice_number && <p className="text-red-500 text-sm">{errors.invoice_number[0]}</p>}
          <input type="datetime-local" value={form.issue_date} onChange={(e) => handleInputChange('issue_date', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.issue_date && <p className="text-red-500 text-sm">{errors.issue_date[0]}</p>}
          <input type="datetime-local" value={form.due_date} onChange={(e) => handleInputChange('due_date', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.due_date && <p className="text-red-500 text-sm">{errors.due_date[0]}</p>}
          <input type="text" placeholder="Status" value={form.status} onChange={(e) => handleInputChange('status', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.status && <p className="text-red-500 text-sm">{errors.status[0]}</p>}
          {form.items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input type="text" placeholder="Item Name" value={item.item_name} onChange={(e) => handleItemChange(index, 'item_name', e.target.value)} className="flex-1 p-2 border rounded" required />
              <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-20 p-2 border rounded" required />
              <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="w-24 p-2 border rounded" required />
            </div>
          ))}
          {errors.items && <p className="text-red-500 text-sm">{errors.items[0]}</p>}
          <button type="button" onClick={addItem} className="bg-blue-500 text-white p-2 rounded">Add Item</button>
          <textarea placeholder="Notes" value={form.notes} onChange={(e) => handleInputChange('notes', e.target.value)} className="w-full p-2 border rounded" />
          {errors.notes && <p className="text-red-500 text-sm">{errors.notes[0]}</p>}
          <div className="space-y-2 max-h-32 overflow-y-auto border p-2 rounded">
            {termsConditions.map(tc => (
              <div key={tc.id} className="flex items-start">
                <input
                  type="checkbox"
                  id={`term-${tc.id}`}
                  checked={form.terms_condition_ids.includes(tc.id)}
                  onChange={() => handleTermsChange(tc.id)}
                  className="mt-1 mr-2"
                />
                <label htmlFor={`term-${tc.id}`} className="text-sm text-gray-600">
                  {tc.content.substring(0, 50) + (tc.content.length > 50 ? '...' : '')}
                </label>
              </div>
            ))}
          </div>
          {errors.terms_condition_ids && <p className="text-red-500 text-sm">{errors.terms_condition_ids[0]}</p>}
          <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Create Template</button>
        </form>

        <div className="w-full md:w-1/2 bg-white p-4 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800">Template Preview: {preview.template_name || 'Untitled'}</h3>
          <p><strong>Name:</strong> {preview.name || 'N/A'}</p>
          <p><strong>Email:</strong> {preview.email || 'N/A'}</p>
          <p><strong>Mobile:</strong> {preview.mobile || 'N/A'}</p>
          <p><strong>Address:</strong> {preview.address || 'N/A'}</p>
          <p><strong>Invoice:</strong> {preview.invoice_number || 'N/A'}</p>
          <p><strong>Issue Date:</strong> {preview.issue_date || 'N/A'}</p>
          <p><strong>Due Date:</strong> {preview.due_date || 'N/A'}</p>
          <p><strong>Status:</strong> {preview.status || 'pending'}</p>
          <ul className="mt-2">
            {preview.items.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-600">
                {item.item_name || 'Unnamed Item'} - {item.quantity} x ${item.price} = ${(item.quantity * item.price).toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="text-lg font-bold mt-2">Total: ${calculateTotal(preview.items)}</p>
          {preview.notes && <p><strong>Notes:</strong> {preview.notes}</p>}
          {preview.terms_condition_ids.length > 0 && (
            <div className="mt-2">
              <strong>Terms and Conditions:</strong>
              <ul className="list-disc pl-5">
                {preview.terms_condition_ids.map(id => {
                  const term = termsConditions.find(tc => tc.id === id);
                  return term ? (
                    <li key={id} className="text-sm text-gray-600">{term.content}</li>
                  ) : null;
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateCreate;