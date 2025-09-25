import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { columns } from './ClientListColumns'; // Import the column definitions
import { DataTable } from './DataTable'; // Import our new DataTable component

const ClientList = ({ refreshKey }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/clients', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (Array.isArray(response.data)) {
                    setClients(response.data);
                } else {
                    setError('Received an unexpected data format.');
                }
            } catch (err) {
                setError('Failed to fetch clients.');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [refreshKey]);

    if (loading) return <div>Loading clients...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <DataTable columns={columns} data={clients} />
        </div>
    );
};

export default ClientList;