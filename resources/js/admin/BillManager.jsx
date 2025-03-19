import React, { useState, useEffect } from 'react';

const BillManager = ({ token }) => {
  const [bills, setBills] = useState([]);
  const [templates, setTemplates] = useState([]);
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
  const [preview, setPreview] = useState(form); // Default preview matches initial form

  useEffect(() => {
    fetch('/api/bills', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setBills)
      .catch(err => console.error('Error fetching bills:', err));
    fetch('/api/bill-templates', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setTemplates)
      .catch(err => console.error('Error fetching templates:', err));
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingBill ? 'PUT' : 'POST';
    const url = editingBill ? `/api/bills/${editingBill.id}` : '/api/bills';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(updatedBill => {
        if (editingBill) {
          setBills(bills.map(b => b.id === updatedBill.id ? updatedBill : b));
          setEditingBill(null);
        } else {
          setBills([...bills, updatedBill]);
        }
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
        setPreview(resetForm); // Reset preview to default form state
      })
      .catch(err => console.error('Error saving bill:', err));
  };

  const [editingBill, setEditingBill] = useState(null);

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setForm({
      name: bill.name,
      email: bill.email,
      mobile: bill.mobile,
      address: bill.address,
      invoice_number: bill.invoice_number,
      issue_date: bill.issue_date.slice(0, 16),
      due_date: bill.due_date.slice(0, 16),
      status: bill.status,
      notes: bill.notes || '',
      items: bill.items.map(item => ({ ...item })),
    });
    setPreview({
      name: bill.name,
      email: bill.email,
      mobile: bill.mobile,
      address: bill.address,
      invoice_number: bill.invoice_number,
      issue_date: bill.issue_date.slice(0, 16),
      due_date: bill.due_date.slice(0, 16),
      status: bill.status,
      notes: bill.notes || '',
      items: bill.items.map(item => ({ ...item })),
    });
  };

  const handleDelete = (id) => {
    fetch(`/api/bills/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setBills(bills.filter(b => b.id !== id));
    });
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

  const downloadPdf = (billId) => {
    window.open(`/api/bills/${billId}/pdf`, '_blank');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800">Bill Manager</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-4 bg-white p-4 rounded-2xl shadow-lg">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Invoice Number"
            value={form.invoice_number}
            onChange={(e) => handleInputChange('invoice_number', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="datetime-local"
            value={form.issue_date}
            onChange={(e) => handleInputChange('issue_date', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="datetime-local"
            value={form.due_date}
            onChange={(e) => handleInputChange('due_date', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Status"
            value={form.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <select
            onChange={(e) => applyTemplate(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose Template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>{template.template_name}</option>
            ))}
          </select>
          {form.items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Item Name"
                value={item.item_name}
                onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                className="flex-1 p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="w-20 p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                className="w-24 p-2 border rounded"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Item
          </button>
          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded w-full"
          >
            {editingBill ? 'Update Bill' : 'Create Bill'}
          </button>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {bills.map(bill => (
          <div key={bill.id} className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-800">{bill.name}</h3>
            <p className="text-sm text-gray-600">Invoice: {bill.invoice_number}</p>
            <p className="text-sm text-gray-600">Total: ${bill.total_amount}</p>
            <p className="text-sm text-gray-600">Status: {bill.status}</p>
            <ul className="mt-2">
              {bill.items.map(item => (
                <li key={item.id} className="text-sm text-gray-600">
                  {item.item_name} - {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>
            <button
              onClick={() => downloadPdf(bill.id)}
              className="mt-2 bg-purple-500 text-white p-2 rounded w-full"
            >
              Download PDF
            </button>
            <button
              onClick={() => handleEdit(bill)}
              className="mt-2 bg-blue-500 text-white p-2 rounded w-full"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(bill.id)}
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

export default BillManager;