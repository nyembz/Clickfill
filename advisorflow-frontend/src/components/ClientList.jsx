import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClientList = ({ refreshKey }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            setLoading(false);
            return;
        }

        const response = await axios.get('/api/clients', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // NEW: Add this check
        if (Array.isArray(response.data)) {
            setClients(response.data);
        } else {
            // This will now show a user-friendly error instead of crashing
            setError('Received an unexpected data format from the server.');
            console.error('API did not return an array:', response.data);
        }

    } catch (err) {
        setError('Failed to fetch clients.');
        console.error(err);
    } finally {
        setLoading(false);
    }
};

        fetchClients();
    }, [refreshKey]); 

    if (loading) return <div>Loading clients...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h3>Your Clients</h3>
            {clients.length === 0 ? (
                <p>No clients found.</p>
            ) : (
                <ul>
                    {clients.map(client => (
                        <li key={client.id}>
                            <Link to={`/client/${client.id}`}>
                                {client.first_name} {client.last_name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClientList;