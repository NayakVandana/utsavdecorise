import React, { useEffect, useState } from 'react'; // Update this
import axios from 'axios';

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUsers(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <table className="w-full mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.is_admin ? 'Admin' : 'User'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;