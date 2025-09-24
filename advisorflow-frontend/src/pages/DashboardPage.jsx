// src/pages/DashboardPage.jsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
      <p className="mb-6">You are successfully logged in.</p>
      <Button onClick={handleLogout} variant="destructive">Logout</Button>
    </div>
  );
};

export default DashboardPage;