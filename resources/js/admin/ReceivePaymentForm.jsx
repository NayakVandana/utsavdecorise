import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ReceivePaymentForm = ({ token, user }) => {
  const { billId } = useParams();
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
  const [loading, setLoading] = useState(true); // Add loading state
  const [submissionError, setSubmissionError] = useState(null); // Add submission error state

  useEffect(() => {
    const fetchBill = async () => {
      try {
        setLoading(true);
        setSubmissionError(null);
        const response = await api.get(`/bills/${billId}`);
        setBill(response.data || null);
      } catch (err) {
        console.error('Error fetching bill:', err);
        setSubmissionError(err.response?.data?.message || 'Failed to load bill. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [billId]);

  const pendingAmount = bill
    ? (bill.total_amount - (bill.receive_payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0)).toFixed(2)
    : '0.00';

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: null });
    setSubmissionError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmissionError(null);
    setLoading(true);

    try {
      await api.post(`/bills/${billId}/payments`, form);
      const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
      navigate(`${basePath}/bills`);
    } catch (err) {
      console.error('Error adding payment:', err);
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setSubmissionError('Failed to add payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
    navigate(`${basePath}/bills`);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Add Payment</h2>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
          >
            Back
          </button>
        </div>
        <p className="text-red-600 text-lg">Bill not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Add Payment for Bill #{bill.invoice_number}
        </h2>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
        >
          Back
        </button>
      </div>

      {/* Pending Amount */}
      <p className="text-sm text-gray-600 mb-6">
        <strong>Pending Amount:</strong> ${pendingAmount}
      </p>

      {/* Submission Error */}
      {submissionError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{submissionError}</p>
        </div>
      )}

      {/* Form */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter payment amount"
              value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              step="0.01"
              max={pendingAmount}
              min="0"
              required
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount[0]}</p>}
          </div>

          <div>
            <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
            <select
              id="payment_type"
              value={form.payment_type}
              onChange={(e) => handleChange('payment_type', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="">Select Payment Type</option>
              <option value="advance">Advance</option>
              <option value="to_complete">To Complete</option>
            </select>
            {errors.payment_type && <p className="text-red-500 text-sm mt-1">{errors.payment_type[0]}</p>}
          </div>

          <div>
            <label htmlFor="mode_of_payment" className="block text-sm font-medium text-gray-700 mb-1">Mode of Payment</label>
            <select
              id="mode_of_payment"
              value={form.mode_of_payment}
              onChange={(e) => handleChange('mode_of_payment', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="">Select Mode of Payment</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
            </select>
            {errors.mode_of_payment && <p className="text-red-500 text-sm mt-1">{errors.mode_of_payment[0]}</p>}
          </div>

          <div>
            <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input
              type="datetime-local"
              id="payment_date"
              value={form.payment_date}
              onChange={(e) => handleChange('payment_date', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            {errors.payment_date && <p className="text-red-500 text-sm mt-1">{errors.payment_date[0]}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="notes"
              placeholder="Enter any additional notes"
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows="3"
            />
            {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes[0]}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 p-3 rounded-lg transition text-sm sm:text-base font-semibold ${
                loading ? 'bg-green-300 text-gray-100 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {loading ? 'Adding Payment...' : 'Add Payment'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceivePaymentForm;