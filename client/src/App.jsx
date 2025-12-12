// client/src/App.jsx - FINAL FIXED VERSION
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next'; // Keeping this import since other components might use it

// Import our page components
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
 * A component that protects routes by checking for a JWT token in localStorage.
 * This ensures authentication is persistent across page refreshes.
 */
const ProtectedRoute = ({ children }) => {
    // 🎯 FINAL FIX: Check localStorage for the token directly 🎯
    const token = localStorage.getItem('token'); 

    if (!token) {
        // Redirects the user to the /login path if no token is found
        return <Navigate to="/login" replace />;
    }
    return children;
};
// ----------------------------------------------------------------------

function App() {
  // We no longer need the isAuthenticated state since the ProtectedRoute handles the check.
  // However, if the Login component requires setIsAuthenticated as a prop, we must keep the state.
  
  // Keeping the state hook just to satisfy the prop requirement of the Login component:
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); 

  // We keep this for now to test translations easily (if needed by other components)
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
        
        {/* Login Route - Passes the state setter to update local state on successful login */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} /> 

        {/* 🛑 CRITICAL FIXED ROUTE: Dashboard 🛑 */}
        <Route 
          path="/dashboard" // This path matches the successful redirect from Login.jsx
          element={
            // The ProtectedRoute component handles the actual logic of checking the token.
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