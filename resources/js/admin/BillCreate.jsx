import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const BillCreate = ({ token }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    invoice_number: '',
    issue_date: '',
    due_date: '',
    status: 'pending',
    notes: '',
    items: [{ item_name: '', quantity: 1, price: 0 }],
  });
  const [preview, setPreview] = useState(form);
  const [templates, setTemplates] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bills', form);
      const resetForm = {
        name: '',
        email: '',
        mobile: '',
        address: '',
        invoice_number: '',
        issue_date: '',
        due_date: '',
        status: 'pending',
        notes: '',
        items: [{ item_name: '', quantity: 1, price: 0 }],
      };
      setForm(resetForm);
      setPreview(resetForm);
      const user = JSON.parse(localStorage.getItem('user'));
      const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
      navigate(`${basePath}/bills`);
    } catch (err) {
      console.error('Error creating bill:', err);
    }
  };

  const applyTemplate = (templateId) => {
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      const updatedForm = {
        name: template.name,
        email: template.email,
        mobile: template.mobile,
        address: template.address,
        invoice_number: '',
        issue_date: template.issue_date.slice(0, 16),
        due_date: template.due_date.slice(0, 16),
        status: template.status,
        notes: template.notes || '',
        items: template.items.map(item => ({ ...item })),
      };
      setForm(updatedForm);
      setPreview(updatedForm);
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

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2);
  };

  const handleBack = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
    navigate(`${basePath}/bills`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Create Bill</h2>
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Back
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-4 bg-white p-4 rounded-2xl shadow-lg">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full p-2 border rounded" required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Mobile" value={form.mobile} onChange={(e) => handleInputChange('mobile', e.target.value)} className="w-full p-2 border rounded" required />
          <textarea placeholder="Address" value={form.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Invoice Number" value={form.invoice_number} onChange={(e) => handleInputChange('invoice_number', e.target.value)} className="w-full p-2 border rounded" required />
          <input type="datetime-local" value={form.issue_date} onChange={(e) => handleInputChange('issue_date', e.target.value)} className="w-full p-2 border rounded" required />
          <input type="datetime-local" value={form.due_date} onChange={(e) => handleInputChange('due_date', e.target.value)} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Status" value={form.status} onChange={(e) => handleInputChange('status', e.target.value)} className="w-full p-2 border rounded" required />
          <select onChange={(e) => applyTemplate(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Choose Template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>{template.template_name}</option>
            ))}
          </select>
          {form.items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input type="text" placeholder="Item Name" value={item.item_name} onChange={(e) => handleItemChange(index, 'item_name', e.target.value)} className="flex-1 p-2 border rounded" required />
              <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-20 p-2 border rounded" required />
              <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="w-24 p-2 border rounded" required />
            </div>
          ))}
          <button type="button" onClick={addItem} className="bg-blue-500 text-white p-2 rounded">Add Item</button>
          <textarea placeholder="Notes" value={form.notes} onChange={(e) => handleInputChange('notes', e.target.value)} className="w-full p-2 border rounded" />
          <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Create Bill</button>
        </form>

        <div className="w-full md:w-1/2 bg-white p-4 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800">Bill Preview</h3>
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
        </div>
      </div>
    </div>
  );
};

export default BillCreate;