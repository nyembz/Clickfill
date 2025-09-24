// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">

        <nav className="p-4 bg-white rounded-lg shadow-md mb-8">
          <Link to="/login" className="p-2 mx-2 text-gray-700 hover:text-blue-600 font-medium">Login</Link>
          <Link to="/register" className="p-2 mx-2 text-gray-700 hover:text-blue-600 font-medium">Register</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>

      </div>
    </Router>
  );
}
export default App;