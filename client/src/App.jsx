// client/src/App.jsx - FINAL CONFIRMED PROTECTION FIX
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next'; 

// Import components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Footer from './components/Footer';
import Register from './pages/Register';

// ----------------------------------------------------------------------
/**
 * Protected Route Component: Checks for the token.
 */
const ProtectedRoute = ({ children }) => {
    // This MUST block access if the token is missing.
    const token = localStorage.getItem('token'); 

    if (!token) {
        // Blocks access and redirects to the login page
        return <Navigate to="/login" replace />;
    }
    return children;
};
// ----------------------------------------------------------------------

function App() {
  // Keeping the state hook just to satisfy the prop requirement of the Login component:
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const { t } = useTranslation(); 
  
  return (
    <div className="portfolio-app">
      <Navbar /> 

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Login Route */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} /> 

        {/* 🛑 FIX: The Admin Dashboard is now ONLY accessible via the PROTECTED route /admin 🛑 */}
        <Route 
          path="/admin" // Admin access path
          element={
            <ProtectedRoute> // The crucial protection wrapper
              <AdminDashboard />
            </ProtectedRoute>
          } 
        /> 

        {/* FIX: Redirect old /dashboard URL to the protected /admin path */}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;