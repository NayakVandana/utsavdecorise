import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const TemplateCreate = ({ token }) => {
    const [form, setForm] = useState({
        template_name: '',
        name: '',
        email: '',
        mobile: '',
        address: '',
        invoice_number: '',
        issue_date: '',
        due_date: '',
        status: 'pending',
        items: [{ item_name: '', quantity: 1, price: 0 }],
        notes: '',
        terms_condition_ids: [],
    });
    const [preview, setPreview] = useState({
        ...form,
    });
    const [termsConditions, setTermsConditions] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchTermsConditions = async () => {
            try {
                const response = await api.get('/terms-conditions');
                setTermsConditions(response.data || []);
            } catch (err) {
                console.error('Error fetching terms and conditions:', err);
                setErrors({ general: 'Failed to load terms and conditions. Please try again.' });
            }
        };
        fetchTermsConditions();

        // Pre-fill form with cloned template data
        const clonedTemplate = location.state?.clonedTemplate;
        const newTemplateName = location.state?.newTemplateName;
        if (clonedTemplate) {
            const parsedItems = clonedTemplate.items
                ? typeof clonedTemplate.items === 'string'
                    ? JSON.parse(clonedTemplate.items)
                    : clonedTemplate.items
                : [{ item_name: '', quantity: 1, price: 0 }];

            const clonedForm = {
                template_name: newTemplateName || clonedTemplate.template_name || '',
                name: clonedTemplate.name || '',
                email: clonedTemplate.email || '',
                mobile: clonedTemplate.mobile || '',
                address: clonedTemplate.address || '',
                invoice_number: clonedTemplate.invoice_number || '',
                issue_date: clonedTemplate.issue_date ? clonedTemplate.issue_date.slice(0, 16) : '',
                due_date: clonedTemplate.due_date ? clonedTemplate.due_date.slice(0, 16) : '',
                status: clonedTemplate.status || 'pending',
                items: parsedItems,
                notes: clonedTemplate.notes || '',
                terms_condition_ids: clonedTemplate.terms_conditions?.map(tc => tc.id) || [],
            };
            setForm(clonedForm);
            setPreview(clonedForm);
        }
    }, [token, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        // Convert items array to JSON string
        const payload = {
            ...form,
            items: JSON.stringify(form.items), // Convert array to JSON string
            terms_condition_ids: form.terms_condition_ids,
        };

        try {
            await api.post('/bill-templates', payload);
            const resetForm = {
                template_name: '',
                name: '',
                email: '',
                mobile: '',
                address: '',
                invoice_number: '',
                issue_date: '',
                due_date: '',
                status: 'pending',
                items: [{ item_name: '', quantity: 1, price: 0 }],
                notes: '',
                terms_condition_ids: [],
            };
            setForm(resetForm);
            setPreview(resetForm);
            setErrors({});
            const user = JSON.parse(localStorage.getItem('user'));
            const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
            navigate(`${basePath}/templates`);
        } catch (err) {
            console.error('Error creating template:', err);
            if (err.response && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'Failed to create template. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        const newItems = [...form.items, { item_name: '', quantity: 1, price: 0 }];
        setForm({ ...form, items: newItems });
        setPreview({ ...form, items: newItems });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...form.items];
        newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
        setForm({ ...form, items: newItems });
        setPreview({ ...form, items: newItems });
    };

    const handleInputChange = (field, value) => {
        const updatedForm = { ...form, [field]: value };
        setForm(updatedForm);
        setPreview(updatedForm);
    };

    const handleTermsChange = (termId) => {
        const updatedIds = form.terms_condition_ids.includes(termId)
            ? form.terms_condition_ids.filter(id => id !== termId)
            : [...form.terms_condition_ids, termId];
        setForm({ ...form, terms_condition_ids: updatedIds });
        setPreview({ ...form, terms_condition_ids: updatedIds });
    };

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2);
    };

    const handleBack = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const basePath = user?.is_admin === 2 ? '/superadmin' : '/admin';
        navigate(`${basePath}/templates`);
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Create Template</h2>
                <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
                >
                    Back
                </button>
            </div>

            {errors.general && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
                    <p className="text-sm font-medium">{errors.general}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Template Details</h3>
                            <div>
                                <label htmlFor="template_name" className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                                <input
                                    type="text"
                                    id="template_name"
                                    placeholder="Enter template name"
                                    value={form.template_name}
                                    onChange={(e) => handleInputChange('template_name', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                                {errors.template_name && <p className="text-red-500 text-sm mt-1">{errors.template_name[0]}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Sample Customer Details</h3>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Sample Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter sample customer name"
                                    value={form.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Sample Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter sample customer email"
                                    value={form.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Sample Mobile</label>
                                <input
                                    type="text"
                                    id="mobile"
                                    placeholder="Enter sample customer mobile"
                                    value={form.mobile}
                                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Sample Address</label>
                                <textarea
                                    id="address"
                                    placeholder="Enter sample customer address"
                                    value={form.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    rows="3"
                                    required
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Sample Bill Details</h3>
                            <div>
                                <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700 mb-1">Sample Invoice Number</label>
                                <input
                                    type="text"
                                    id="invoice_number"
                                    placeholder="Enter sample invoice number"
                                    value={form.invoice_number}
                                    onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                                {errors.invoice_number && <p className="text-red-500 text-sm mt-1">{errors.invoice_number[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700 mb-1">Sample Issue Date</label>
                                <input
                                    type="datetime-local"
                                    id="issue_date"
                                    value={form.issue_date}
                                    onChange={(e) => handleInputChange('issue_date', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                                {errors.issue_date && <p className="text-red-500 text-sm mt-1">{errors.issue_date[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">Sample Due Date</label>
                                <input
                                    type="datetime-local"
                                    id="due_date"
                                    value={form.due_date}
                                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                                {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Sample Status</label>
                                <input
                                    type="text"
                                    id="status"
                                    value={form.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                    disabled
                                />
                                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Items</h3>
                            {form.items.map((item, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <div className="flex-1">
                                        <label htmlFor={`item_name_${index}`} className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                        <input
                                            type="text"
                                            id={`item_name_${index}`}
                                            placeholder="Enter item name"
                                            value={item.item_name}
                                            onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            required
                                        />
                                    </div>
                                    <div className="w-20">
                                        <label htmlFor={`quantity_${index}`} className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                                        <input
                                            type="number"
                                            id={`quantity_${index}`}
                                            placeholder="Qty"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label htmlFor={`price_${index}`} className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <input
                                            type="number"
                                            id={`price_${index}`}
                                            placeholder="Price"
                                            value={item.price}
                                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                            {errors.items && <p className="text-red-500 text-sm">{errors.items[0]}</p>}
                            <button
                                type="button"
                                onClick={addItem}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base font-semibold"
                            >
                                Add Item
                            </button>
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                id="notes"
                                placeholder="Enter any additional notes"
                                value={form.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                rows="3"
                            />
                            {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes[0]}</p>}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Terms and Conditions</h3>
                            <div className="max-h-32 overflow-y-auto border border-gray-300 p-3 rounded-lg">
                                {termsConditions.length > 0 ? (
                                    termsConditions.map(tc => (
                                        <div key={tc.id} className="flex items-start mb-2">
                                            <input
                                                type="checkbox"
                                                id={`term-${tc.id}`}
                                                checked={form.terms_condition_ids.includes(tc.id)}
                                                onChange={() => handleTermsChange(tc.id)}
                                                className="mt-1 mr-2 h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`term-${tc.id}`} className="text-sm text-gray-600">
                                                {tc.content.length > 50 ? `${tc.content.substring(0, 50)}...` : tc.content}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No terms and conditions available.</p>
                                )}
                            </div>
                            {errors.terms_condition_ids && <p className="text-red-500 text-sm">{errors.terms_condition_ids[0]}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full p-3 rounded-lg transition text-sm sm:text-base font-semibold ${
                                loading ? 'bg-green-300 text-gray-100 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            {loading ? 'Creating Template...' : 'Create Template'}
                        </button>
                    </form>
                </div>

                <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Template Preview: {preview.template_name || 'Untitled'}</h3>
                    <div className="space-y-3 text-gray-700">
                        <p><strong>Name:</strong> {preview.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {preview.email || 'N/A'}</p>
                        <p><strong>Mobile:</strong> {preview.mobile || 'N/A'}</p>
                        <p><strong>Address:</strong> {preview.address || 'N/A'}</p>
                        <p><strong>Invoice:</strong> {preview.invoice_number || 'N/A'}</p>
                        <p><strong>Issue Date:</strong> {preview.issue_date ? new Date(preview.issue_date).toLocaleString() : 'N/A'}</p>
                        <p><strong>Due Date:</strong> {preview.due_date ? new Date(preview.due_date).toLocaleString() : 'N/A'}</p>
                        <p><strong>Status:</strong> {preview.status ? preview.status.charAt(0).toUpperCase() + preview.status.slice(1) : 'Pending'}</p>
                        <div>
                            <strong>Items:</strong>
                            {preview.items && preview.items.length > 0 ? (
                                <ul className="mt-2 space-y-1">
                                    {preview.items.map((item, idx) => (
                                        <li key={idx} className="text-sm text-gray-600">
                                            {item.item_name || 'Unnamed Item'} - {item.quantity} x ${parseFloat(item.price).toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 mt-1">No items added.</p>
                            )}
                        </div>
                        <p className="text-lg font-bold mt-2">Total: ${calculateTotal(preview.items)}</p>
                        {preview.notes && <p><strong>Notes:</strong> {preview.notes}</p>}
                        {preview.terms_condition_ids.length > 0 && (
                            <div className="mt-4">
                                <strong>Terms and Conditions:</strong>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    {preview.terms_condition_ids.map(id => {
                                        const term = termsConditions.find(tc => tc.id === id);
                                        return term ? (
                                            <li key={id} className="text-sm text-gray-600">{term.content}</li>
                                        ) : null;
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateCreate;