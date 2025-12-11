// client/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';

// Import our page components
import Navbar from './components/Navbar';
import LanguageSwitcher from './components/LanguageSwitcher';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Footer from './components/Footer';
import Register from './pages/Register';

// 🎯 ADD THIS COMPONENT DEFINITION HERE 🎯
/**
 * A component that protects routes. If the user is not authenticated,
 * they are redirected to the /login path. Otherwise, the child components are rendered.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated.
 * @param {boolean} props.isAuthenticated - The current authentication status.
 */
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    // Redirects the user to the /login path if not authenticated
    return <Navigate to="/login" replace />;
  }
  return children;
};
// ----------------------------------------------------------------------

function App() {
  // 1. Initialize authentication state (defaults to false)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 2. We keep this for now to test translations easily
  const { t } = useTranslation(); 
  
  /*
  // Optional: Example of how you might update isAuthenticated later
  // This is often done in a separate function called after a successful login.
  // We'll keep it commented out for now as the prompt didn't request a login function.
  useEffect(() => {
    // Check local storage or make an API call here to truly determine the state
    // For now, we'll just log the state.
    console.log(`Authentication state: ${isAuthenticated ? 'Authenticated' : 'Not Authenticated'}`);
  }, [isAuthenticated]);
  */

  return (
    <div className="portfolio-app">
      {/* 1. The Navbar is always visible */}
      <Navbar /> 

      {/* 3. Define the routes (paths) for the website */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} /> 
        {/* Note: In a real app, Login would likely pass a function to update the state */}

        {/* The Admin Route uses the component defined above */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        /> 
      </Routes>
      <Footer />
    </div>
  )
}

export default App