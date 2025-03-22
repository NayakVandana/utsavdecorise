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
  const [showPayment, setShowPayment] = useState(false); // New state for toggling payment section
  const [templates, setTemplates] = useState([]);
  const [termsConditions, setTermsConditions] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const apiUrl = 'http://localhost:8001';

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/bill-templates');
        setTemplates(response.data);
      } catch (err) {
        console.error('Error fetching templates:', err);
      }
    };
    const fetchTermsConditions = async () => {
      try {
        const response = await api.get('/terms-conditions');
        setTermsConditions(response.data);
      } catch (err) {
        console.error('Error fetching terms and conditions:', err);
      }
    };
    fetchTemplates();
    fetchTermsConditions();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    // Add payment data only if checkbox is checked and fields are filled
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
      setShowPayment(false); // Reset checkbox state
      setErrors({});
      const user = JSON.parse(localStorage.getItem('user'));
      const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
      navigate(`${basePath}/bills`);
    } catch (err) {
      console.error('Error creating bill:', err);
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
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
        bill_copy: null,
        terms_condition_ids: template.terms_conditions ? template.terms_conditions.map(tc => tc.id) : [],
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
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Create Bill</h2>
        <button onClick={handleBack} className="bg-gray-500 text-white p-2 rounded">Back</button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-4 bg-white p-4 rounded-2xl shadow-lg">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
          <input type="text" placeholder="Mobile" value={form.mobile} onChange={(e) => handleInputChange('mobile', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile[0]}</p>}
          <textarea placeholder="Address" value={form.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.address && <p className="text-red-500 text-sm">{errors.address[0]}</p>}
          <input type="text" placeholder="Invoice Number" value={form.invoice_number} onChange={(e) => handleInputChange('invoice_number', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.invoice_number && <p className="text-red-500 text-sm">{errors.invoice_number[0]}</p>}
          <input type="datetime-local" value={form.issue_date} onChange={(e) => handleInputChange('issue_date', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.issue_date && <p className="text-red-500 text-sm">{errors.issue_date[0]}</p>}
          <input type="datetime-local" value={form.due_date} onChange={(e) => handleInputChange('due_date', e.target.value)} className="w-full p-2 border rounded" required />
          {errors.due_date && <p className="text-red-500 text-sm">{errors.due_date[0]}</p>}
          <input type="text" placeholder="Status" value={form.status} onChange={(e) => handleInputChange('status', e.target.value)} className="w-full p-2 border rounded" disabled />
          {errors.status && <p className="text-red-500 text-sm">{errors.status[0]}</p>}
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
          {errors.items && <p className="text-red-500 text-sm">{errors.items[0]}</p>}
          <button type="button" onClick={addItem} className="bg-blue-500 text-white p-2 rounded">Add Item</button>
          <textarea placeholder="Notes" value={form.notes} onChange={(e) => handleInputChange('notes', e.target.value)} className="w-full p-2 border rounded" />
          {errors.notes && <p className="text-red-500 text-sm">{errors.notes[0]}</p>}
          <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="w-full p-2 border rounded" />
          {errors.bill_copy && <p className="text-red-500 text-sm">{errors.bill_copy[0]}</p>}

          {/* Payment Checkbox and Section */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="add-payment"
              checked={showPayment}
              onChange={(e) => setShowPayment(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="add-payment" className="text-lg font-semibold">Add Payment</label>
          </div>
          {showPayment && (
            <fieldset className="border p-4 rounded">
              <legend className="text-lg font-semibold">Payment Details</legend>
              <input
                type="number"
                placeholder="Amount"
                value={form.payment.amount}
                onChange={(e) => handlePaymentChange('amount', e.target.value)}
                className="w-full p-2 border rounded mb-2"
                step="0.01"
              />
              {errors['payment.amount'] && <p className="text-red-500 text-sm">{errors['payment.amount'][0]}</p>}
              <select
                value={form.payment.payment_type}
                onChange={(e) => handlePaymentChange('payment_type', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select Payment Type</option>
                <option value="advance">Advance</option>
                <option value="to_complete">To Complete</option>
              </select>
              {errors['payment.payment_type'] && <p className="text-red-500 text-sm">{errors['payment.payment_type'][0]}</p>}
              <select
                value={form.payment.mode_of_payment}
                onChange={(e) => handlePaymentChange('mode_of_payment', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select Mode of Payment</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
              </select>
              {errors['payment.mode_of_payment'] && <p className="text-red-500 text-sm">{errors['payment.mode_of_payment'][0]}</p>}
              <input
                type="datetime-local"
                value={form.payment.payment_date}
                onChange={(e) => handlePaymentChange('payment_date', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              {errors['payment.payment_date'] && <p className="text-red-500 text-sm">{errors['payment.payment_date'][0]}</p>}
              <textarea
                placeholder="Payment Notes"
                value={form.payment.notes}
                onChange={(e) => handlePaymentChange('notes', e.target.value)}
                className="w-full p-2 border rounded"
              />
              {errors['payment.notes'] && <p className="text-red-500 text-sm">{errors['payment.notes'][0]}</p>}
            </fieldset>
          )}

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
          {preview.bill_copy && <p><strong>Bill Copy:</strong> {preview.bill_copy}</p>}

          {/* Payment Preview - Show only if checkbox is checked */}
          {showPayment && (preview.payment.amount || preview.payment.payment_type) && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Payment</h4>
              <p><strong>Amount:</strong> ${preview.payment.amount || 'N/A'}</p>
              <p><strong>Type:</strong> {preview.payment.payment_type ? preview.payment.payment_type.replace('_', ' ').toUpperCase() : 'N/A'}</p>
              <p><strong>Mode:</strong> {preview.payment.mode_of_payment ? preview.payment.mode_of_payment.replace('_', ' ').toUpperCase() : 'N/A'}</p>
              <p><strong>Date:</strong> {preview.payment.payment_date || 'N/A'}</p>
              {preview.payment.notes && <p><strong>Notes:</strong> {preview.payment.notes}</p>}
              <p><strong>Balance Due:</strong> ${(calculateTotal(preview.items) - (parseFloat(preview.payment.amount) || 0)).toFixed(2)}</p>
            </div>
          )}

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

export default BillCreate;