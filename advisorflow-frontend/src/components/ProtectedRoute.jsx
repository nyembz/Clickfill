// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If there's no token, redirect to the login page
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;