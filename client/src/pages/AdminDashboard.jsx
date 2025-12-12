// client/src/pages/AdminDashboard.jsx - COMPLETE CRASH-PROOF VERSION
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
// 🛑 CRASH PREVENTION: REMOVE THE TRANSLATION IMPORT 🛑
// import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; 

// Use the dynamic API URL from the environment
const API_URL = 'https://enchanting-upliftment-production.up.railway.app/api';

// 🛑 CRASH PREVENTION: Create a DUMMY 't' function 🛑
const dummyT = (key) => key;

const AdminDashboard = () => {
    // 🛑 CRASH PREVENTION: USE THE DUMMY 't' INSTEAD OF THE HOOK 🛑
    const t = dummyT;
    const navigate = useNavigate();

    // --- STATE DECLARATIONS ---
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        descriptionEn: '',
        descriptionFr: '',
        imageUrl: '',
        link: ''
    });

    // 🎯 Authenticated Axios Instance (CRITICAL for all CRUD operations) 🎯
    const getAuthClient = () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/admin');
            return null;
        }

        return axios.create({
            baseURL: API_URL,
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
    };

    // --- Data Fetching ---
    const fetchProjects = async () => {
        const client = getAuthClient();
        if (!client) return; 

        setLoading(true);
        try {
            // Use the authenticated client
            const response = await client.get('/projects'); 
            setProjects(response.data);
        } catch (err) {
            console.error("Error fetching projects:", err);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/admin');
            }
            setStatusMessage("Error loading projects.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []); 

    // --- Form Handlers ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const client = getAuthClient();
        if (!client) return; 

        setStatusMessage('Processing...');
        
        try {
            if (isEditing) {
                await client.put(`/projects/${currentProject._id}`, formData);
                setStatusMessage(`SUCCESS: Project updated!`);
            } else {
                await client.post('/projects', formData);
                setStatusMessage(`SUCCESS: Project added!`);
            }
            
            // Reset form state
            setFormData({ title: '', descriptionEn: '', descriptionFr: '', imageUrl: '', link: '' });
            setIsEditing(false);
            setCurrentProject(null);
            fetchProjects(); // Refresh the list
        } catch (error) {
            console.error("Submission Error:", error);
            setStatusMessage(`ERROR: Failed to save project.`);
        }
    };

    // --- CRUD Actions ---
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        
        const client = getAuthClient();
        if (!client) return; 

        setStatusMessage('Deleting project...');
        try {
            await client.delete(`/projects/${id}`);
            setStatusMessage('SUCCESS: Project deleted.');
            fetchProjects(); // Refresh the list
        } catch (error) {
            setStatusMessage('ERROR: Failed to delete project.');
        }
    };

    const handleEdit = (project) => {
        setIsEditing(true);
        setCurrentProject(project);
        setFormData({
            title: project.title,
            descriptionEn: project.descriptionEn,
            descriptionFr: project.descriptionFr,
            imageUrl: project.imageUrl,
            link: project.link
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // --- Render Logic ---
    if (!localStorage.getItem('token')) {
        // The redirect happens inside getAuthClient, but this is a safeguard.
        return <div className="container">Redirecting to login...</div>;
    }
    if (loading) return <div className="container">Loading dashboard...</div>;

    return (
        <div className="container admin-container">
            {/* 🛑 TEST STRING: If you see this, the component is loading! 🛑 */}
            <h1 style={{color: 'red'}}>DASHBOARD LOAD TEST SUCCESSFUL</h1> 
            {/* 🛑 TEST STRING 🛑 */}
            <h2 className="page-header">{t(isEditing ? "Edit Project" : "Add New Project")}</h2> 
            {statusMessage && <p className={`status-message ${statusMessage.startsWith('SUCCESS') ? 'success' : 'error'}`}>{statusMessage}</p>}
            
            {/* The submission/edit form */}
            <form onSubmit={handleFormSubmit} className="project-form">
                <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} required />
                <textarea name="descriptionEn" placeholder="English Description" value={formData.descriptionEn} onChange={handleChange} required />
                <textarea name="descriptionFr" placeholder="Description Française" value={formData.descriptionFr} onChange={handleChange} required />
                <input type="url" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required />
                <input type="url" name="link" placeholder="Live Link or GitHub URL (Optional)" value={formData.link} onChange={handleChange} />

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