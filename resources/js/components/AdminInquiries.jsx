import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        axios.get('/api/inquiries')
            .then(response => setInquiries(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Message</th>
                </tr>
            </thead>
            <tbody>
                {inquiries.map(inquiry => (
                    <tr key={inquiry.id}>
                        <td className="border p-2">{inquiry.name}</td>
                        <td className="border p-2">{inquiry.email}</td>
                        <td className="border p-2">{inquiry.message}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default AdminInquiries;