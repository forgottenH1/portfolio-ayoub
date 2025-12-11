// client/src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Use the same API URL logic as your Projects page
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // Note: This calls the NEW endpoint we create in the backend
            const response = await axios.post(`${API_URL}/auth/register`, { username, password });
            
            setMessage(t('register_success', 'Registration successful! Redirecting to login...'));
            // Redirect to the Admin Login page after 2 seconds
            setTimeout(() => {
                navigate('/admin');
            }, 2000);

        } catch (error) {
            setMessage(t('register_failed', 'Registration failed. ') + (error.response?.data?.message || 'Server error.'));
            console.error(error);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-login-box">
                <h2>{t('register_title', 'Admin Registration')}</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder={t('username', 'Username')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder={t('password', 'Password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{t('register_button', 'Register New Admin')}</button>
                </form>
                {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default Register;