import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AllReceivePayments = ({ token, user }) => {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('/all-payments');
        setPayments(response.data);
      } catch (err) {
        console.error('Error fetching all payments:', err);
      }
    };
    fetchPayments();
  }, [token]);

  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Received Payments</h2>
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Bill Invoice</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Mode</th>
              <th className="p-2 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map(payment => (
                <tr key={payment.id}>
                  <td className="p-2 border">{payment.bill?.invoice_number || 'N/A'}</td>
                  <td className="p-2 border">{payment.bill?.name || 'N/A'}</td>
                  <td className="p-2 border">{new Date(payment.payment_date).toLocaleString()}</td>
                  <td className="p-2 border">${parseFloat(payment.amount).toFixed(2)}</td>
                  <td className="p-2 border">{payment.payment_type.toUpperCase()}</td>
                  <td className="p-2 border">{payment.mode_of_payment.toUpperCase().replace('_', ' ')}</td>
                  <td className="p-2 border">{payment.notes || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-2 border text-center">No payments received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => navigate(`${basePath}/bills`)}
        className="mt-4 bg-gray-500 text-white p-2 rounded"
      >
        Back to Bills
      </button>
    </div>
  );
};

export default AllReceivePayments;