import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ClientList from '../components/ClientList';
import AddClientForm from '../components/AddClientForm';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // This 'key' is a simple trick to force the ClientList to re-fetch data
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleClientAdded = () => {
    setIsModalOpen(false); // Close the modal
    setRefreshKey(oldKey => oldKey + 1); // Increment the key to trigger a refresh
  };

  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <div className="flex gap-2">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button>Add New Client</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your new client. Click save when you're done.
                    </DialogDescription>
                    </DialogHeader>
                    <AddClientForm onSuccess={handleClientAdded} />
                </DialogContent>
            </Dialog>
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
        </div>
      </div>

      <hr className="mb-6" />
      
      <div className="text-left">
        <ClientList refreshKey={refreshKey} /> {/* Pass the key here */}
      </div>
    </div>
  );
};

export default DashboardPage;