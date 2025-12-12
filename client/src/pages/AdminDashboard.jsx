// client/src/pages/AdminDashboard.jsx - FINAL CRASH PREVENTION VERSION
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
// 🛑 CRASH PREVENTION: REMOVE THE TRANSLATION IMPORT 🛑
// import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; 

// Use the dynamic API URL from the environment
const API_URL = 'https://enchanting-upliftment-production.up.railway.app/api';

// 🛑 CRASH PREVENTION: Create a DUMMY 't' function 🛑
// This will allow the component to compile and run even if i18n is broken or missing.
const dummyT = (key) => key;

const AdminDashboard = () => {
    // 🛑 CRASH PREVENTION: USE THE DUMMY 't' INSTEAD OF THE HOOK 🛑
    const t = dummyT;
    const navigate = useNavigate();
    
    // ... rest of your state declarations (unchanged) ...
    // ...
    
    // --- Render Logic ---
    if (!localStorage.getItem('token')) {
        return <div className="container">Redirecting to login...</div>;
    }
    if (loading) return <div className="container">Loading dashboard...</div>;

    return (
        <div className="container admin-container">
            {/* The h2 below will use t() but it will safely return the string */}
            <h2 className="page-header">{t(isEditing ? "Edit Project" : "Add New Project")}</h2> 
            {statusMessage && <p className={`status-message ${statusMessage.startsWith('SUCCESS') ? 'success' : 'error'}`}>{statusMessage}</p>}
            
            {/* ... rest of the form and table (unchanged) ... */}
            
            {/* The submission/edit form */}
            <form onSubmit={handleFormSubmit} className="project-form">
                {/* ... inputs ... */}
                <button type="submit" className="submit-button">
                    {t(isEditing ? "Save Changes" : "Add Project")}
                </button>
                {isEditing && (
                    <button 
                        type="button" 
                        onClick={() => { setIsEditing(false); setFormData({ title: '', descriptionEn: '', descriptionFr: '', imageUrl: '', link: '' }); }}
                        className="cancel-button"
                    >
                        {t("Cancel Edit")}
                    </button>
                )}
            </form>
            
            {/* ... rest of the table ... */}
        </div>
    );
};

export default AdminDashboard;