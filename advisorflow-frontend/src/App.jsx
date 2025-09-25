import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ProtectedRoute from '@/components/ProtectedRoute';

// A simple component to render navigation links conditionally
const Navigation = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Don't show nav links on the dashboard page
  if (token && location.pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav className="p-4 bg-white rounded-lg shadow-md mb-8">
      <Link to="/login" className="p-2 mx-2 text-gray-700 hover:text-blue-600 font-medium">Login</Link>
      <Link to="/register" className="p-2 mx-2 text-gray-700 hover:text-blue-600 font-medium">Register</Link>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <Navigation />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;