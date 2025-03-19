import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Add Link
import api from '../utils/api';

const BillList = ({ token, user }) => { // Add user prop
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await api.get('/bills');
        setBills(response.data);
      } catch (err) {
        console.error('Error fetching bills:', err);
      }
    };
    fetchBills();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bills/${id}`);
      setBills(bills.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting bill:', err);
    }
  };

  const downloadPdf = async (billId) => {
    try {
      const response = await api.get(`/bills/${billId}/pdf`, {
        responseType: 'blob',
      });
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
      alert('Failed to download PDF. Please try again.');
    }
  };

  const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800">Bill List</h2>
      <Link to={`${basePath}/bills/create`} className="bg-green-500 text-white p-2 rounded mb-4 inline-block">
        Create New Bill
      </Link>
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
            <Link
              to={`${basePath}/bills/edit/${bill.id}`}
              className="mt-2 bg-blue-500 text-white p-2 rounded w-full block text-center"
            >
              Edit
            </Link>
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

export default BillList;