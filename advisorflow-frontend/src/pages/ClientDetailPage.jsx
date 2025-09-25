// src/pages/ClientDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DocumentUpload from '../components/DocumentUpload';

const ClientDetailPage = () => {
    const { id } = useParams(); // Gets the ':id' from the URL

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl">
            <Link to="/dashboard" className="text-blue-500 hover:underline mb-4 block">&larr; Back to Dashboard</Link>
            <h1 className="text-3xl font-bold mb-6">Client Profile (ID: {id})</h1>

            <hr className="mb-6" />

            <DocumentUpload clientId={id} />
        </div>
    );
};

export default ClientDetailPage;