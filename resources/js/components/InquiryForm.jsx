import React, { useState } from 'react';
import axios from 'axios';

function InquiryForm() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/inquiries', formData);
            setSuccess('Inquiry submitted successfully!');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error submitting inquiry:', error);
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">Inquire Now</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    className="w-full p-2 mb-2 border rounded"
                    required
                ></textarea>
                <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-800">
                    Submit
                </button>
            </form>
            {success && <p className="text-green-600 mt-2">{success}</p>}
        </div>
    );
}

export default InquiryForm;