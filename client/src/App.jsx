// client/src/App.jsx - FINAL FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';

// Import our page components
import Navbar from './components/Navbar';
// import LanguageSwitcher from './components/LanguageSwitcher'; // Not used in this file
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Footer from './components/Footer';
import Register from './pages/Register';

// ----------------------------------------------------------------------
// 🎯 FIXED AUTHENTICATION COMPONENT 🎯
// Checks if the token exists in localStorage, ensuring persistence across refreshes.

const ProtectedRoute = ({ children }) => {
    // Check for the token, which means the user is authenticated
    const token = localStorage.getItem('token'); 

    if (!token) {
        // Redirects the user to the /login path if no token is found
        return <Navigate to="/login" replace />;
    }
    return children;
};
// ----------------------------------------------------------------------

function App() {
  // 1. Initialize authentication state. 
  // This state is now managed using the token check in the useEffect below.
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  // 2. Check for token on initial component mount to keep the user logged in after refresh
  useEffect(() => {
    // Check if the token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []); // Empty dependency array means this runs only once on initial load

  // 3. Keep useTranslation for other components (if they use it)
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
        
        {/* Login Route - Passes function to set persistent state on successful login */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} /> 

        {/* 🛑 CRITICAL FIX: The Dashboard Route 🛑 */}
        {/* Path must be /dashboard to match the Login component's redirect */}
        <Route 
          path="/dashboard" 
          element={
            {/* Note: ProtectedRoute no longer uses isAuthenticated state, it checks localStorage */}
            <ProtectedRoute> 
              <AdminDashboard />
            </ProtectedRoute>
          } 
        /> 

        {/* Fallback route */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;