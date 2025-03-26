import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const BillList = ({ token, user }) => {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const apiUrl = 'http://localhost:8001';

  useEffect(() => {
    fetchBills();
  }, [token, currentPage, searchKeywords, perPage]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/bills', {
        params: {
          page: currentPage,
          per_page: perPage,
          search_keywords: searchKeywords,
        },
      });
      console.log('Paginated bills data:', response.data);
      console.log('Total bills:', response.data.total);
      console.log('Bills on current page:', response.data.data.length);
      setBills(response.data.data || []);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setPerPage(response.data.per_page);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/bills/${id}`);
        fetchBills(); // Refresh the list after deletion
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
    const totalAmount = parseFloat(bill.total_amount) || 0;
    return totalAmount - totalReceived;
  };

  const handleSearch = (e) => {
    setSearchKeywords(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleClearSearch = () => {
    setSearchKeywords(''); // Clear the search input
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing per page
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

      {/* Search and Per Page Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full sm:w-1/2 relative">
          <input
            type="text"
            placeholder="Search by name, email, mobile, invoice number..."
            value={searchKeywords}
            onChange={handleSearch}
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {searchKeywords && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="perPage" className="text-sm font-medium text-gray-700">Items per page:</label>
          <select
            id="perPage"
            value={perPage}
            onChange={handlePerPageChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-600 text-lg mb-6">Loading...</div>
      )}

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
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
              {!loading && bills.length > 0 ? (
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
                !loading && (
                  <tr>
                    <td colSpan="9" className="py-4 px-6 text-center text-gray-500 align-middle">
                      No bills found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && total > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, total)} of {total} bills
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {lastPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === lastPage
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillList;