// src/components/DocumentUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DocumentUpload = ({ clientId }) => {
    const [file, setFile] = useState(null);
    const [documentType, setDocumentType] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !documentType) {
            setError('Please select a file and a document type.');
            return;
        }

        setStatus('uploading');
        setError(null);

        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', documentType);
        formData.append('issueDate', issueDate);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/clients/${clientId}/documents`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setError(err.response?.data?.message || 'Upload failed.');
            console.error(err);
        }
    };

    return (
        <div className="max-w-md">
            <h3 className="text-xl font-semibold mb-4">Upload a New Document</h3>
            <div className="grid gap-4 py-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select onValueChange={setDocumentType} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a type..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IDENTITY">Identity</SelectItem>
                            <SelectItem value="PROOF_OF_ADDRESS">Proof of Address</SelectItem>
                            <SelectItem value="BANK_STATEMENT">Bank Statement</SelectItem>
                            <SelectItem value="COMPANY_REGISTRATION">Company Registration</SelectItem>
                            <SelectItem value="TAX_DOCUMENT">Tax Document</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="issueDate">Issue Date (if applicable)</Label>
                    <Input type="date" id="issueDate" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="file">File</Label>
                    <Input id="file" type="file" onChange={handleFileChange} required />
                </div>
                <Button onClick={handleUpload} disabled={status === 'uploading'}>
                    {status === 'uploading' ? 'Uploading...' : 'Upload Document'}
                </Button>

                {status === 'success' && <p className="text-green-600">File uploaded successfully!</p>}
                {status === 'error' && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default DocumentUpload;