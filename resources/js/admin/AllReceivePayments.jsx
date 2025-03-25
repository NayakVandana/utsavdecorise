import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AllReceivePayments = ({ token, user }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('/all-payments');
        console.log('Payments response:', response.data); // Debug: Check data format
        setPayments(response.data || []); // Default to empty array if no data
      } catch (err) {
        console.error('Error fetching all payments:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load payments');
      }
    };
    fetchPayments();
  }, [token]);

  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">All Received Payments</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
            <tr>
              <th className="py-3 px-6 text-left font-semibold w-1/6">Bill Invoice</th>
              <th className="py-3 px-6 text-left font-semibold w-1/6">Customer</th>
              <th className="py-3 px-6 text-center font-semibold w-1/6">Date</th>
              <th className="py-3 px-6 text-center font-semibold w-1/8">Amount</th>
              <th className="py-3 px-6 text-center font-semibold w-1/8">Type</th>
              <th className="py-3 px-6 text-center font-semibold w-1/8">Mode</th>
              <th className="py-3 px-6 text-left font-semibold w-1/4">Notes</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {payments.length > 0 ? (
              payments.map(payment => (
                <tr key={payment.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-left align-middle w-1/6 truncate">{payment.bill?.invoice_number || 'N/A'}</td>
                  <td className="py-4 px-6 text-left align-middle w-1/6 truncate">{payment.bill?.name || 'N/A'}</td>
                  <td className="py-4 px-6 text-center align-middle w-1/6">
                    {payment.payment_date ? new Date(payment.payment_date).toLocaleString() : 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-center align-middle w-1/8">
                    ${payment.amount ? parseFloat(payment.amount).toFixed(2) : '0.00'}
                  </td>
                  <td className="py-4 px-6 text-center align-middle w-1/8">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        payment.payment_type.toLowerCase() === 'full'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.payment_type ? payment.payment_type.toUpperCase() : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center align-middle w-1/8">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        payment.mode_of_payment.toLowerCase() === 'cash'
                          ? 'bg-blue-100 text-blue-800'
                          : payment.mode_of_payment.toLowerCase() === 'online'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {payment.mode_of_payment
                        ? payment.mode_of_payment.toUpperCase().replace('_', ' ')
                        : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left align-middle w-1/4 truncate">
                    {payment.notes || 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 px-6 text-center text-gray-500 align-middle">
                  No payments received yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* <button
        onClick={() => navigate(`${basePath}/bills`)}
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
      >
        Back to Bills
      </button> */}
    </div>
  );
};

export default AllReceivePayments;