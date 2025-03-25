import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const BillList = ({ token, user }) => {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();
  const apiUrl = 'http://localhost:8001';

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await api.get('/bills');
        console.log('Raw bills data:', response.data); // Debug: Check total_amount format
        setBills(response.data || []); // Default to empty array if no data
      } catch (err) {
        console.error('Error fetching bills:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load bills');
      }
    };
    fetchBills();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/bills/${id}`);
        setBills(bills.filter(b => b.id !== id));
        setError(null);
      } catch (err) {
        console.error('Error deleting bill:', err);
        setError(err.response?.data?.message || 'Failed to delete bill');
      }
    }
  };

  const downloadPdf = async (billId) => {
    try {
      const response = await api.get(`/bills/${billId}/pdf`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bill_${billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF.');
    }
  };

  const downloadPaymentStatement = async (billId) => {
    try {
      const response = await api.get(`/bills/${billId}/payment-statement`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payment_statement_${billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading payment statement:', err);
      setError('Failed to download payment statement.');
    }
  };

  const hasPayments = (bill) => {
    return bill.receive_payments && bill.receive_payments.length > 0;
  };

  const getPendingAmount = (bill) => {
    const totalReceived = bill.receive_payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
    const totalAmount = parseFloat(bill.total_amount) || 0; // Convert to number, default to 0 if invalid
    return totalAmount - totalReceived;
  };

  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Bill List</h2>
        <Link
          to={`${basePath}/bills/create`}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base font-semibold"
        >
          Create New Bill
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
            <tr>
              <th className="py-3 px-6 text-left font-semibold w-1/12">Name</th>
              <th className="py-3 px-6 text-left font-semibold w-1/12">Invoice #</th>
              <th className="py-3 px-6 text-center font-semibold w-1/12">Total</th>
              <th className="py-3 px-6 text-center font-semibold w-1/12">Pending</th>
              <th className="py-3 px-6 text-center font-semibold w-1/12">Status</th>
              <th className="py-3 px-6 text-left font-semibold w-2/12">Items</th>
              <th className="py-3 px-6 text-center font-semibold w-1/12">Bill Copy</th>
              <th className="py-3 px-6 text-left font-semibold w-2/12">Payments</th>
              <th className="py-3 px-6 text-left font-semibold w-2/12">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {bills.length > 0 ? (
              bills.map(bill => (
                <tr key={bill.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-left align-middle w-1/12 truncate">{bill.name || 'N/A'}</td>
                  <td className="py-4 px-6 text-left align-middle w-1/12 truncate">{bill.invoice_number || 'N/A'}</td>
                  <td className="py-4 px-6 text-center align-middle w-1/12">
                    ${(parseFloat(bill.total_amount) || 0).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center align-middle w-1/12">
                    ${getPendingAmount(bill).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center align-middle w-1/12">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        bill.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : bill.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {bill.status ? bill.status.charAt(0).toUpperCase() + bill.status.slice(1) : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left align-middle w-2/12">
                    {bill.items && bill.items.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {bill.items.map(item => (
                          <li key={item.id} className="truncate">
                            {item.item_name} ({item.quantity} x ${parseFloat(item.price).toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'No Items'
                    )}
                  </td>
                  <td className="py-4 px-6 text-center align-middle w-1/12">
                    {bill.bill_copy ? (
                      bill.bill_copy.endsWith('.pdf') ? (
                        <a
                          href={`${apiUrl}${bill.bill_copy}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-xs sm:text-sm"
                        >
                          PDF
                        </a>
                      ) : (
                        <a
                          href={`${apiUrl}${bill.bill_copy}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-xs sm:text-sm"
                        >
                          Image
                        </a>
                      )
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-4 px-6 text-left align-middle w-2/12">
                    {hasPayments(bill) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {bill.receive_payments.map(payment => (
                          <li key={payment.id} className="truncate">
                            ${parseFloat(payment.amount).toFixed(2)} (
                            {payment.mode_of_payment
                              ? payment.mode_of_payment.charAt(0).toUpperCase() +
                                payment.mode_of_payment.slice(1).replace('_', ' ')
                              : 'N/A'}
                            ,{' '}
                            {payment.payment_date
                              ? new Date(payment.payment_date).toLocaleDateString()
                              : 'N/A'}
                            )
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'No Payments'
                    )}
                  </td>
                  <td className="py-4 px-6 text-left align-middle w-2/12">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => downloadPdf(bill.id)}
                        className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-xs sm:text-sm"
                      >
                        PDF
                      </button>
                      {!hasPayments(bill) && (
                        <Link
                          to={`${basePath}/bills/edit/${bill.id}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs sm:text-sm"
                        >
                          Edit
                        </Link>
                      )}
                      {getPendingAmount(bill) > 0 && (
                        <Link
                          to={`${basePath}/bills/${bill.id}/payments/add`}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-xs sm:text-sm"
                        >
                          Add Payment
                        </Link>
                      )}
                      {hasPayments(bill) && (
                        <>
                          <Link
                            to={`${basePath}/bills/${bill.id}/payments`}
                            className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-xs sm:text-sm"
                          >
                            Payments
                          </Link>
                          <button
                            onClick={() => downloadPaymentStatement(bill.id)}
                            className="px-3 py-1 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-xs sm:text-sm"
                          >
                            Statement
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-4 px-6 text-center text-gray-500 align-middle">
                  No bills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillList;