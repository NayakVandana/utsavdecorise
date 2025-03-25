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
    bill_copy: null,
    terms_condition_ids: [],
    payment: {
      amount: '',
      payment_type: '',
      mode_of_payment: '',
      payment_date: '',
      notes: '',
    },
  });
  const [preview, setPreview] = useState({
    ...form,
    bill_copy: null,
    payment: { ...form.payment },
  });
  const [showPayment, setShowPayment] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [termsConditions, setTermsConditions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const apiUrl = 'http://localhost:8001';

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/bill-templates');
        setTemplates(response.data || []);
      } catch (err) {
        console.error('Error fetching templates:', err);
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
    fetchTemplates();
    fetchTermsConditions();
  }, [token]);

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

    if (showPayment && (form.payment.amount || form.payment.payment_type || form.payment.mode_of_payment || form.payment.payment_date)) {
      formData.append('payment[amount]', form.payment.amount);
      formData.append('payment[payment_type]', form.payment.payment_type);
      formData.append('payment[mode_of_payment]', form.payment.mode_of_payment);
      formData.append('payment[payment_date]', form.payment.payment_date);
      formData.append('payment[notes]', form.payment.notes || '');
    }

    try {
      await api.post('/bills', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const resetForm = {
        name: '', email: '', mobile: '', address: '', invoice_number: '',
        issue_date: '', due_date: '', status: 'pending', notes: '',
        items: [{ item_name: '', quantity: 1, price: 0 }],
        bill_copy: null, terms_condition_ids: [],
        payment: { amount: '', payment_type: '', mode_of_payment: '', payment_date: '', notes: '' },
      };
      setForm(resetForm);
      setPreview({ ...resetForm, bill_copy: null, payment: { ...resetForm.payment } });
      setShowPayment(false);
      setErrors({});
      const user = JSON.parse(localStorage.getItem('user'));
      const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
      navigate(`${basePath}/bills`);
    } catch (err) {
      console.error('Error creating bill:', err);
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: 'Failed to create bill. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (templateId) => {
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      const updatedForm = {
        name: template.name || '',
        email: template.email || '',
        mobile: template.mobile || '',
        address: template.address || '',
        invoice_number: '',
        issue_date: template.issue_date ? template.issue_date.slice(0, 16) : '',
        due_date: template.due_date ? template.due_date.slice(0, 16) : '',
        status: template.status || 'pending',
        notes: template.notes || '',
        items: template.items && template.items.length > 0
          ? template.items.map(item => ({ ...item }))
          : [{ item_name: '', quantity: 1, price: 0 }],
        bill_copy: null,
        terms_condition_ids: template.terms_conditions
          ? template.terms_conditions.map(tc => tc.id)
          : [],
        payment: { amount: '', payment_type: '', mode_of_payment: '', payment_date: '', notes: '' },
      };
      setForm(updatedForm);
      setPreview({ ...updatedForm, bill_copy: null, payment: { ...updatedForm.payment } });
    }
  };

  const addItem = () => {
    const newItems = [...form.items, { item_name: '', quantity: 1, price: 0 }];
    setForm({ ...form, items: newItems });
    setPreview({ ...form, items: newItems, bill_copy: form.bill_copy ? form.bill_copy.name : null });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setForm({ ...form, items: newItems });
    setPreview({ ...form, items: newItems, bill_copy: form.bill_copy ? form.bill_copy.name : null });
  };

  const handleInputChange = (field, value) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    setPreview({ ...updatedForm, bill_copy: form.bill_copy ? form.bill_copy.name : null });
  };

  const handlePaymentChange = (field, value) => {
    const updatedPayment = { ...form.payment, [field]: value };
    setForm({ ...form, payment: updatedPayment });
    setPreview({ ...form, payment: updatedPayment, bill_copy: form.bill_copy ? form.bill_copy.name : null });
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
    setPreview({ ...form, terms_condition_ids: updatedIds, bill_copy: form.bill_copy ? form.bill_copy.name : null });
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
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Create Bill</h2>
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
                <input
                  type="text"
                  id="status"
                  value={form.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  disabled
                />
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>}
              </div>
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">Choose Template</label>
                <select
                  id="template"
                  onChange={(e) => applyTemplate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Select a Template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>{template.template_name}</option>
                  ))}
                </select>
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

            {/* Payment Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="add-payment"
                  checked={showPayment}
                  onChange={(e) => setShowPayment(e.target.checked)}
                  className="mr-2 h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="add-payment" className="text-lg font-semibold text-gray-800">Add Payment</label>
              </div>
              {showPayment && (
                <fieldset className="border p-4 rounded-lg border-gray-300 space-y-4">
                  <legend className="text-lg font-semibold text-gray-800 px-2">Payment Details</legend>
                  <div>
                    <label htmlFor="payment_amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      id="payment_amount"
                      placeholder="Enter payment amount"
                      value={form.payment.amount}
                      onChange={(e) => handlePaymentChange('amount', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      step="0.01"
                    />
                    {errors['payment.amount'] && <p className="text-red-500 text-sm mt-1">{errors['payment.amount'][0]}</p>}
                  </div>
                  <div>
                    <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                    <select
                      id="payment_type"
                      value={form.payment.payment_type}
                      onChange={(e) => handlePaymentChange('payment_type', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Select Payment Type</option>
                      <option value="advance">Advance</option>
                      <option value="to_complete">To Complete</option>
                    </select>
                    {errors['payment.payment_type'] && <p className="text-red-500 text-sm mt-1">{errors['payment.payment_type'][0]}</p>}
                  </div>
                  <div>
                    <label htmlFor="mode_of_payment" className="block text-sm font-medium text-gray-700 mb-1">Mode of Payment</label>
                    <select
                      id="mode_of_payment"
                      value={form.payment.mode_of_payment}
                      onChange={(e) => handlePaymentChange('mode_of_payment', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Select Mode of Payment</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                    </select>
                    {errors['payment.mode_of_payment'] && <p className="text-red-500 text-sm mt-1">{errors['payment.mode_of_payment'][0]}</p>}
                  </div>
                  <div>
                    <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <input
                      type="datetime-local"
                      id="payment_date"
                      value={form.payment.payment_date}
                      onChange={(e) => handlePaymentChange('payment_date', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    {errors['payment.payment_date'] && <p className="text-red-500 text-sm mt-1">{errors['payment.payment_date'][0]}</p>}
                  </div>
                  <div>
                    <label htmlFor="payment_notes" className="block text-sm font-medium text-gray-700 mb-1">Payment Notes</label>
                    <textarea
                      id="payment_notes"
                      placeholder="Enter payment notes"
                      value={form.payment.notes}
                      onChange={(e) => handlePaymentChange('notes', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      rows="3"
                    />
                    {errors['payment.notes'] && <p className="text-red-500 text-sm mt-1">{errors['payment.notes'][0]}</p>}
                  </div>
                </fieldset>
              )}
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
              {loading ? 'Creating Bill...' : 'Create Bill'}
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

            {/* Payment Preview */}
            {showPayment && (preview.payment.amount || preview.payment.payment_type) && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800">Payment</h4>
                <p><strong>Amount:</strong> ${parseFloat(preview.payment.amount).toFixed(2) || 'N/A'}</p>
                <p><strong>Type:</strong> {preview.payment.payment_type ? preview.payment.payment_type.replace('_', ' ').toUpperCase() : 'N/A'}</p>
                <p><strong>Mode:</strong> {preview.payment.mode_of_payment ? preview.payment.mode_of_payment.replace('_', ' ').toUpperCase() : 'N/A'}</p>
                <p><strong>Date:</strong> {preview.payment.payment_date ? new Date(preview.payment.payment_date).toLocaleString() : 'N/A'}</p>
                {preview.payment.notes && <p><strong>Notes:</strong> {preview.payment.notes}</p>}
                <p><strong>Balance Due:</strong> ${(calculateTotal(preview.items) - (parseFloat(preview.payment.amount) || 0)).toFixed(2)}</p>
              </div>
            )}

            {/* Terms and Conditions Preview */}
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

export default BillCreate;