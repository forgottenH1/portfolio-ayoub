// client/src/App.jsx - FINAL CONFIRMED PROTECTION FIX WITH DEBUGGING
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
    // 🛑 DEBUGGING STEP: Log the token status 🛑
    const token = localStorage.getItem('token'); 
    console.log(`[ProtectedRoute Debug]: Token found? ${!!token}`);

    if (!token) {
        // Blocks access and redirects to the login page
        return <Navigate to="/login" replace />;
    }
    return children;
};
// ----------------------------------------------------------------------

function App() {
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

        {/* 🛑 PROTECTED ROUTE: /admin 🛑 */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute> 
              <AdminDashboard />
            </ProtectedRoute>
          } 
        /> 

        {/* Redirect /dashboard to the protected /admin path */}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;