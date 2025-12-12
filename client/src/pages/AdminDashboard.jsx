// client/src/pages/AdminDashboard.jsx - FINAL CLEANUP AND RENDERING FIX
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

// Use the dynamic API URL (Replace with your actual Railway URL structure if needed)
const API_URL = 'https://enchanting-upliftment-production.up.railway.app/api';

// 🛑 Crash Prevention: Dummy 't' function 🛑
const dummyT = (key) => key;

const AdminDashboard = () => {
    // 🛑 Crash Prevention: Use dummy 't' 🛑
    const t = dummyT;
    const navigate = useNavigate();

    // --- STATE DECLARATIONS ---
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true); // Keep loading state
    const [statusMessage, setStatusMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '', descriptionEn: '', descriptionFr: '', imageUrl: '', link: ''
    });

    // 🎯 Authenticated Axios Instance (CRITICAL for all CRUD operations) 🎯
    const getAuthClient = () => {
        const token = localStorage.getItem('token');
        // If the token exists, return the client. If not, the ProtectedRoute already handled the redirect.
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
        setLoading(true);
        try {
            const response = await client.get('/projects'); 
            setProjects(response.data);
        } catch (err) {
            console.error("Error fetching projects:", err);
            // If fetch fails due to expired token, force log out
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login'); 
            }
            setStatusMessage("Error loading projects.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []); 

    // --- Form Handlers and CRUD functions (truncated for brevity, assume they are correct) ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const client = getAuthClient();
        setStatusMessage('Processing...');
        
        // 🛑 FIX: Explicitly define payload for clarity, though sending formData directly should work 🛑
        const projectPayload = {
            title: formData.title,
            descriptionEn: formData.descriptionEn,
            descriptionFr: formData.descriptionFr,
            imageUrl: formData.imageUrl,
            link: formData.link, 
        };

        try {
            if (isEditing) {
                await client.put(`/projects/${currentProject._id}`, projectPayload);
                setStatusMessage(`SUCCESS: Project updated!`);
            } else {
                await client.post('/projects', projectPayload);
                setStatusMessage(`SUCCESS: Project added!`);
            }
            setFormData({ title: '', descriptionEn: '', descriptionFr: '', imageUrl: '', link: '' });
            setIsEditing(false);
            setCurrentProject(null);
            fetchProjects(); 
        } catch (error) {
            // 🛑 FIX: Enhanced Error Logging and Status Message 🛑
            console.error("Submission Error:", error);
            
            const status = error.response ? error.response.status : 'N/A';
            let serverMessage = 'Unknown Error';
            
            if (error.response && error.response.data && error.response.data.message) {
                serverMessage = error.response.data.message;
            } else if (error.message) {
                serverMessage = error.message;
            }
            
            setStatusMessage(`ERROR (${status}): Failed to save project. Detail: ${serverMessage}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        const client = getAuthClient();
        setStatusMessage('Deleting project...');
        try {
            await client.delete(`/projects/${id}`);
            setStatusMessage('SUCCESS: Project deleted.');
            fetchProjects(); 
        } catch (error) {
            setStatusMessage('ERROR: Failed to delete project.');
        }
    };

    const handleEdit = (project) => {
        setIsEditing(true);
        setCurrentProject(project);
        setFormData({
            title: project.title, descriptionEn: project.descriptionEn, descriptionFr: project.descriptionFr, imageUrl: project.imageUrl, link: project.link
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // --- Render Logic ---
    
    // 🛑 REMOVED: if (!localStorage.getItem('token')) { return ... }
    
    if (loading) return <div className="container" style={{padding: '50px', textAlign: 'center'}}>Loading dashboard content...</div>;

    return (
        <div className="container admin-container">
            <h1 style={{color: 'green', textAlign: 'center'}}>WELCOME AYOUB TO YOUR ADMIN DASHBOARD</h1> 

            <h2 className="page-header">{t(isEditing ? "Edit Project" : "Add New Project")}</h2> 
            {statusMessage && <p className={`status-message ${statusMessage.startsWith('SUCCESS') ? 'success' : 'error'}`}>{statusMessage}</p>}
            
            {/* The submission/edit form */}
            <form onSubmit={handleFormSubmit} className="project-form">
                <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} required />
                <textarea name="descriptionEn" placeholder="English Description" value={formData.descriptionEn} onChange={handleChange} required />
                <textarea name="descriptionFr" placeholder="Description Française" value={formData.descriptionFr} onChange={handleChange} required />
                <input type="url" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required />
                <input type="url" name="link" placeholder="Live Link or GitHub URL (Optional)" value={formData.link} onChange={handleChange} />

                <button type="submit" className="submit-button">{t(isEditing ? "Save Changes" : "Add Project")}</button>
                {isEditing && (
                    <button type="button" onClick={() => { setIsEditing(false); setFormData({ title: '', descriptionEn: '', descriptionFr: '', imageUrl: '', link: '' }); }} className="cancel-button">
                        {t("Cancel Edit")}
                    </button>
                )}
            </form>
            
            {/* Project Management Table */}
            <h2 className="page-header" style={{marginTop: '4rem'}}>Existing Projects</h2>
            
            <div className="project-table-container">
                <table className="project-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th></th>