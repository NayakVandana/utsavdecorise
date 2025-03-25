import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ReceivePaymentList = ({ token, user }) => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [bill, setBill] = useState(null);
  const [error, setError] = useState(null); // Add error state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const billResponse = await api.get(`/bills/${billId}`);
        setBill(billResponse.data || null);
        const paymentsResponse = await api.get(`/bills/${billId}/payments`);
        setPayments(paymentsResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [billId]);

  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';

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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Received Payments</h2>
          <button
            onClick={() => navigate(`${basePath}/bills`)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
          >
            Back
          </button>
        </div>
        <p className="text-red-600 text-lg">Bill not found.</p>
      </div>
    );
  }

  const pendingAmount = (bill.total_amount - (bill.receive_payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0)).toFixed(2);

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Received Payments for Bill #{bill.invoice_number}
        </h2>
        <button
          onClick={() => navigate(`${basePath}/bills`)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
        >
          Back
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Bill Summary */}
      <div className="mb-6 space-y-2">
        <p className="text-sm text-gray-600">
          <strong>Customer:</strong> {bill.name || 'N/A'}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Total Amount:</strong> ${parseFloat(bill.total_amount).toFixed(2) || '0.00'}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Pending Amount:</strong> ${pendingAmount}
        </p>
      </div>

      {/* Payments Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
              <tr>
                <th className="py-3 px-6 text-left font-semibold w-2/12">Date</th>
                <th className="py-3 px-6 text-center font-semibold w-2/12">Amount</th>
                <th className="py-3 px-6 text-center font-semibold w-2/12">Type</th>
                <th className="py-3 px-6 text-center font-semibold w-2/12">Mode</th>
                <th className="py-3 px-6 text-left font-semibold w-4/12">Notes</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {payments.length > 0 ? (
                payments.map(payment => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6 text-left align-middle w-2/12">
                      {payment.payment_date ? new Date(payment.payment_date).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-center align-middle w-2/12">
                      ${parseFloat(payment.amount).toFixed(2) || '0.00'}
                    </td>
                    <td className="py-4 px-6 text-center align-middle w-2/12">
                      {payment.payment_type ? payment.payment_type.toUpperCase() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-center align-middle w-2/12">
                      {payment.mode_of_payment
                        ? payment.mode_of_payment.toUpperCase().replace('_', ' ')
                        : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-left align-middle w-4/12 truncate">
                      {payment.notes || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 px-6 text-center text-gray-500 align-middle">
                    No payments received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceivePaymentList;