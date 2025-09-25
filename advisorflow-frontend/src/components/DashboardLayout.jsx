import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Breadcrumbs from '@/components/Breadcrumbs';

const DashboardLayout = () => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 ml-64 p-8 overflow-y-auto">
      <Breadcrumbs />
      <div className="mt-6">
        <Outlet /> 
      </div>
    </main>
  </div>
);

export default DashboardLayout;