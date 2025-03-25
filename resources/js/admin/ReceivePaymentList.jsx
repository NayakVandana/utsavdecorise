import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ReceivePaymentList = ({ token, user }) => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const billResponse = await api.get(`/bills/${billId}`);
        setBill(billResponse.data);
        const paymentsResponse = await api.get(`/bills/${billId}/payments`);
        setPayments(paymentsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [billId]);

  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';

  if (!bill) return <div>Loading...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8">

<div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Create Template</h2>
        <button onClick={() => navigate(`${basePath}/bills`)} className="bg-gray-500 text-white p-2 rounded">Back</button>
      </div>


      
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Received Payments for Bill #{bill.invoice_number}</h2>
      <p className="text-sm text-gray-600 mb-4">Customer: {bill.name}</p>
      <p className="text-sm text-gray-600 mb-4">Total Amount: ${bill.total_amount}</p>
      <p className="text-sm text-gray-600 mb-4">
        Pending Amount: ${(bill.total_amount - (bill.receive_payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0)).toFixed(2)}
      </p>
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
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
                  <td className="p-2 border">{new Date(payment.payment_date).toLocaleString()}</td>
                  <td className="p-2 border">${parseFloat(payment.amount).toFixed(2)}</td>
                  <td className="p-2 border">{payment.payment_type.toUpperCase()}</td>
                  <td className="p-2 border">{payment.mode_of_payment.toUpperCase().replace('_', ' ')}</td>
                  <td className="p-2 border">{payment.notes || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-2 border text-center">No payments received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* <button
        onClick={() => navigate(`${basePath}/bills`)}
        className="mt-4 bg-gray-500 text-white p-2 rounded"
      >
        Back to Bills
      </button> */}
    </div>
  );
};

export default ReceivePaymentList;