import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ClientDetailPage from '@/pages/ClientDetailPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout'; // Import the new layout

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes that don't have the sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes that use the new DashboardLayout */}
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<Navigate to="/dashboard" />} />
          <Route path="/client/:id" element={<ClientDetailPage />} />
        </Route>
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;