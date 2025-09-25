import React from 'react';
import ClientList from '../components/ClientList';
import AddClientForm from '../components/AddClientForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleClientAdded = () => {
    setIsModalOpen(false);
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
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
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <ClientList refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default DashboardPage;