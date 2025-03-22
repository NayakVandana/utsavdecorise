import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ReceivePaymentForm = ({ token, user }) => {
  const { billId } = useParams(); // Get billId from URL
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [form, setForm] = useState({
    amount: '',
    payment_type: '',
    mode_of_payment: '',
    payment_date: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await api.get(`/bills/${billId}`);
        setBill(response.data);
      } catch (err) {
        console.error('Error fetching bill:', err);
      }
    };
    fetchBill();
  }, [billId]);

  const pendingAmount = bill ? bill.total_amount - (bill.receive_payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0) : 0;

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/bills/${billId}/payments`, form);
      const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
      navigate(`${basePath}/bills`); // Navigate back to bill list
    } catch (err) {
      console.error('Error adding payment:', err);
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  if (!bill) return <div>Loading...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Payment for {bill.invoice_number}</h2>
      <p className="text-sm text-gray-600 mb-4">Pending Amount: ${pendingAmount.toFixed(2)}</p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-2xl shadow-lg max-w-md mx-auto">
        <div>
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className="w-full p-2 border rounded"
            step="0.01"
            max={pendingAmount}
            required
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount[0]}</p>}
        </div>
        <div>
          <select
            value={form.payment_type}
            onChange={(e) => handleChange('payment_type', e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Payment Type</option>
            <option value="advance">Advance</option>
            <option value="to_complete">To Complete</option>
          </select>
          {errors.payment_type && <p className="text-red-500 text-sm">{errors.payment_type[0]}</p>}
        </div>
        <div>
          <select
            value={form.mode_of_payment}
            onChange={(e) => handleChange('mode_of_payment', e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Mode of Payment</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="upi">UPI</option>
          </select>
          {errors.mode_of_payment && <p className="text-red-500 text-sm">{errors.mode_of_payment[0]}</p>}
        </div>
        <div>
          <input
            type="datetime-local"
            value={form.payment_date}
            onChange={(e) => handleChange('payment_date', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {errors.payment_date && <p className="text-red-500 text-sm">{errors.payment_date[0]}</p>}
        </div>
        <div>
          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.notes && <p className="text-red-500 text-sm">{errors.notes[0]}</p>}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-green-500 text-white p-2 rounded flex-1">Add Payment</button>
          <button
            type="button"
            onClick={() => navigate(`${user?.is_admin === 2 ? '/superadmin' : '/admin'}/bills`)}
            className="bg-gray-500 text-white p-2 rounded flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceivePaymentForm;