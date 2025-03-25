import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const BillEdit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    invoice_number: '',
    issue_date: '',
    due_date: '',
    status: '',
    notes: '',
    items: [{ item_name: '', quantity: 1, price: 0 }],
    bill_copy: null,
    terms_condition_ids: [],
  });
  const [preview, setPreview] = useState({
    ...form,
    bill_copy: null,
  });
  const [termsConditions, setTermsConditions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state
  const apiUrl = 'http://localhost:8001';

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await api.get(`/bills/${id}`);
        const billData = response.data;
        const updatedForm = {
          name: billData.name || '',
          email: billData.email || '',
          mobile: billData.mobile || '',
          address: billData.address || '',
          invoice_number: billData.invoice_number || '',
          issue_date: billData.issue_date ? billData.issue_date.slice(0, 16) : '',
          due_date: billData.due_date ? billData.due_date.slice(0, 16) : '',
          status: billData.status || 'pending',
          notes: billData.notes || '',
          items: billData.items && billData.items.length > 0
            ? billData.items
            : [{ item_name: '', quantity: 1, price: 0 }],
          bill_copy: null, // File isn't fetched; only set if user uploads new one
          terms_condition_ids: billData.terms_conditions
            ? billData.terms_conditions.map(tc => tc.id)
            : [],
        };
        setForm(updatedForm);
        setPreview({ ...updatedForm, bill_copy: billData.bill_copy ? billData.bill_copy.split('/').pop() : null });
      } catch (err) {
        console.error('Error fetching bill:', err);
        setErrors({ general: 'Failed to load bill. Please try again.' });
      }
    };

    const fetchTermsConditions = async () => {
      try {
        const response = await api.get('/terms-conditions');
        setTermsConditions(response.data || []);
      } catch (err) {
        console.error('Error fetching terms and conditions:', err);
      }
    };

    fetchBill();
    fetchTermsConditions();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('mobile', form.mobile);
    formData.append('address', form.address);
    formData.append('invoice_number', form.invoice_number);
    formData.append('issue_date', form.issue_date);
    formData.append('due_date', form.due_date);
    formData.append('status', form.status);
    formData.append('notes', form.notes || '');
    if (form.bill_copy) formData.append('bill_copy', form.bill_copy);

    form.items.forEach((item, index) => {
      formData.append(`items[${index}][item_name]`, item.item_name);
      formData.append(`items[${index}][quantity]`, item.quantity);
      formData.append(`items[${index}][price]`, item.price);
    });

    form.terms_condition_ids.forEach((id, index) => {
      formData.append(`terms_condition_ids[${index}]`, id);
    });

    try {
      await api.post(`/bills/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setErrors({});
      const user = JSON.parse(localStorage.getItem('user'));
      const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
      navigate(`${basePath}/bills`);
    } catch (err) {
      console.error('Error updating bill:', err);
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: 'Failed to update bill. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    const newItems = [...form.items, { item_name: '', quantity: 1, price: 0 }];
    setForm({ ...form, items: newItems });
    setPreview({ ...form, items: newItems, bill_copy: form.bill_copy ? form.bill_copy.name : preview.bill_copy });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setForm({ ...form, items: newItems });
    setPreview({ ...form, items: newItems, bill_copy: form.bill_copy ? form.bill_copy.name : preview.bill_copy });
  };

  const handleInputChange = (field, value) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    setPreview({ ...updatedForm, bill_copy: form.bill_copy ? form.bill_copy.name : preview.bill_copy });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, bill_copy: file });
    setPreview({ ...form, bill_copy: file ? file.name : null });
  };

  const handleTermsChange = (termId) => {
    const updatedIds = form.terms_condition_ids.includes(termId)
      ? form.terms_condition_ids.filter(id => id !== termId)
      : [...form.terms_condition_ids, termId];
    setForm({ ...form, terms_condition_ids: updatedIds });
    setPreview({ ...form, terms_condition_ids: updatedIds, bill_copy: form.bill_copy ? form.bill_copy.name : preview.bill_copy });
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
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Edit Bill</h2>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
        >
          Back
        </button>
      </div>

      {/* Error Message */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{errors.general}</p>
        </div>
      )}

      {/* Form and Preview Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Form Section */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter customer name"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter customer email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
              </div>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="text"
                  id="mobile"
                  placeholder="Enter customer mobile"
                  value={form.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile[0]}</p>}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  id="address"
                  placeholder="Enter customer address"
                  value={form.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  rows="3"
                  required
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
              </div>
            </div>

            {/* Bill Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Bill Details</h3>
              <div>
                <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                <input
                  type="text"
                  id="invoice_number"
                  placeholder="Enter invoice number"
                  value={form.invoice_number}
                  onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                {errors.invoice_number && <p className="text-red-500 text-sm mt-1">{errors.invoice_number[0]}</p>}
              </div>
              <div>
                <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input
                  type="datetime-local"
                  id="issue_date"
                  value={form.issue_date}
                  onChange={(e) => handleInputChange('issue_date', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                {errors.issue_date && <p className="text-red-500 text-sm mt-1">{errors.issue_date[0]}</p>}
              </div>
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  id="due_date"
                  value={form.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date[0]}</p>}
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Items</h3>
              {form.items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <label htmlFor={`item_name_${index}`} className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      id={`item_name_${index}`}
                      placeholder="Enter item name"
                      value={item.item_name}
                      onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      required
                    />
                  </div>
                  <div className="w-20">
                    <label htmlFor={`quantity_${index}`} className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                    <input
                      type="number"
                      id={`quantity_${index}`}
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      min="1"
                      required
                    />
                  </div>
                  <div className="w-24">
                    <label htmlFor={`price_${index}`} className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      id={`price_${index}`}
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              ))}
              {errors.items && <p className="text-red-500 text-sm">{errors.items[0]}</p>}
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base font-semibold"
              >
                Add Item
              </button>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                id="notes"
                placeholder="Enter any additional notes"
                value={form.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                rows="3"
              />
              {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes[0]}</p>}
            </div>

            {/* Bill Copy */}
            <div>
              <label htmlFor="bill_copy" className="block text-sm font-medium text-gray-700 mb-1">Bill Copy (Image/PDF)</label>
              <input
                type="file"
                id="bill_copy"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {errors.bill_copy && <p className="text-red-500 text-sm mt-1">{errors.bill_copy[0]}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Terms and Conditions</h3>
              <div className="max-h-32 overflow-y-auto border border-gray-300 p-3 rounded-lg">
                {termsConditions.length > 0 ? (
                  termsConditions.map(tc => (
                    <div key={tc.id} className="flex items-start mb-2">
                      <input
                        type="checkbox"
                        id={`term-${tc.id}`}
                        checked={form.terms_condition_ids.includes(tc.id)}
                        onChange={() => handleTermsChange(tc.id)}
                        className="mt-1 mr-2 h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`term-${tc.id}`} className="text-sm text-gray-600">
                        {tc.content.length > 50 ? `${tc.content.substring(0, 50)}...` : tc.content}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No terms and conditions available.</p>
                )}
              </div>
              {errors.terms_condition_ids && <p className="text-red-500 text-sm">{errors.terms_condition_ids[0]}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg transition text-sm sm:text-base font-semibold ${
                loading ? 'bg-green-300 text-gray-100 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {loading ? 'Updating Bill...' : 'Update Bill'}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Bill Preview</h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>Name:</strong> {preview.name || 'N/A'}</p>
            <p><strong>Email:</strong> {preview.email || 'N/A'}</p>
            <p><strong>Mobile:</strong> {preview.mobile || 'N/A'}</p>
            <p><strong>Address:</strong> {preview.address || 'N/A'}</p>
            <p><strong>Invoice:</strong> {preview.invoice_number || 'N/A'}</p>
            <p><strong>Issue Date:</strong> {preview.issue_date ? new Date(preview.issue_date).toLocaleString() : 'N/A'}</p>
            <p><strong>Due Date:</strong> {preview.due_date ? new Date(preview.due_date).toLocaleString() : 'N/A'}</p>
            <p><strong>Status:</strong> {preview.status ? preview.status.charAt(0).toUpperCase() + preview.status.slice(1) : 'Pending'}</p>
            <div>
              <strong>Items:</strong>
              {preview.items && preview.items.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {preview.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      {item.item_name || 'Unnamed Item'} - {item.quantity} x ${parseFloat(item.price).toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-1">No items added.</p>
              )}
            </div>
            <p className="text-lg font-bold mt-2">Total: ${calculateTotal(preview.items)}</p>
            {preview.notes && <p><strong>Notes:</strong> {preview.notes}</p>}
            {preview.bill_copy && <p><strong>Bill Copy:</strong> {preview.bill_copy}</p>}
            {preview.terms_condition_ids.length > 0 && (
              <div className="mt-4">
                <strong>Terms and Conditions:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
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
    </div>
  );
};

export default BillEdit;