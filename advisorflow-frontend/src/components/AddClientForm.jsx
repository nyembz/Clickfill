import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// The form takes a prop 'onSuccess' which is a function to call after a client is added.
const AddClientForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        clientType: 'individual',
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value) => {
        setFormData({ ...formData, clientType: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/clients', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onSuccess(); // Call the success callback passed from the parent
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add client.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientType" className="text-right">Client Type</Label>
                <Select name="clientType" onValueChange={handleSelectChange} defaultValue={formData.clientType}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="legal_entity">Legal Entity</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Client'}
            </Button>
        </form>
    );
};

export default AddClientForm;