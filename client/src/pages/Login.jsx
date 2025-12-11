// client/src/pages/Login.jsx - FIXED VERSION
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Ensure this matches your Railway config
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // 1. Send the request and AWAIT the response
            const response = await axios.post(`${API_URL}/auth/login`, { username, password });
            
            // 2. CRITICAL STEP: Store the token upon success
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                
                // 3. Set success message (Optional, as you are redirecting)
                setMessage("Login Successful! Redirecting...");
                
                // 4. Navigate ONLY AFTER the token is saved
                navigate('/dashboard'); 
            } else {
                setMessage("Login failed: Token not received.");
            }
            
        } catch (error) {
            // This runs only if the server sends a 4xx or 5xx status code.
            const errorMessage = error.response?.data?.message || "Invalid Username or Password";
            setMessage(errorMessage);
            console.error(error);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-login-box">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Log In</button>
                </form>
                {message && <p className={`message ${message.includes('Successful') ? 'success' : 'error'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default Login;