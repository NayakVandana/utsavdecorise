import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const BillList = ({ token, user }) => {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();
  const apiUrl = 'http://localhost:8001';

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await api.get('/bills');
        console.log('Raw bills data:', response.data); // Debug: Check total_amount format
        setBills(response.data);
      } catch (err) {
        console.error('Error fetching bills:', err);
      }
    };
    fetchBills();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/bills/${id}`);
        setBills(bills.filter(b => b.id !== id));
      } catch (err) {
        console.error('Error deleting bill:', err);
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
      alert('Failed to download PDF.');
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
      alert('Failed to download payment statement.');
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
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Bill List</h2>
        <Link to={`${basePath}/bills/create`} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Create New Bill
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Invoice #</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Pending</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Items</th>
              <th className="py-3 px-4 text-left">Bill Copy</th>
              <th className="py-3 px-4 text-left">Payments</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {bills.length > 0 ? (
              bills.map(bill => (
                <tr key={bill.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-4">{bill.name}</td>
                  <td className="py-4 px-4">{bill.invoice_number}</td>
                  <td className="py-4 px-4">${(parseFloat(bill.total_amount) || 0).toFixed(2)}</td>
                  <td className="py-4 px-4">${getPendingAmount(bill).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${bill.status === 'paid' ? 'bg-green-100 text-green-800' : bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <ul className="list-disc list-inside">
                      {bill.items.map(item => (
                        <li key={item.id}>
                          {item.item_name} ({item.quantity} x ${item.price})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-4">
                    {bill.bill_copy ? (
                      bill.bill_copy.endsWith('.pdf') ? (
                        <a href={`${apiUrl}${bill.bill_copy}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">PDF</a>
                      ) : (
                        <a href={`${apiUrl}${bill.bill_copy}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Image</a>
                      )
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {hasPayments(bill) ? (
                      <ul className="list-disc list-inside">
                        {bill.receive_payments.map(payment => (
                          <li key={payment.id}>
                            ${payment.amount} ({payment.mode_of_payment}, {new Date(payment.payment_date).toLocaleDateString()})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'No Payments'
                    )}
                  </td>
                  <td className="py-4 px-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => downloadPdf(bill.id)}
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition text-xs sm:text-sm"
                    >
                      PDF
                    </button>
                    {!hasPayments(bill) && (
                      <Link
                        to={`${basePath}/bills/edit/${bill.id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs sm:text-sm"
                      >
                        Edit
                      </Link>
                    )}
                    {getPendingAmount(bill) > 0 && (
                      <Link
                        to={`${basePath}/bills/${bill.id}/payments/add`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs sm:text-sm"
                      >
                        Add Payment
                      </Link>
                    )}
                    {hasPayments(bill) && (
                      <>
                        <Link
                          to={`${basePath}/bills/${bill.id}/payments`}
                          className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition text-xs sm:text-sm"
                        >
                          Payments
                        </Link>
                        <button
                          onClick={() => downloadPaymentStatement(bill.id)}
                          className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition text-xs sm:text-sm"
                        >
                          Statement
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(bill.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-4 px-4 text-center text-gray-500">No bills found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillList;