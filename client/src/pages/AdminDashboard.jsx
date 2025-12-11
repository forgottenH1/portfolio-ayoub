// client/src/pages/AdminDashboard.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
// 🛑 REPLACE apiClient with axios for full control 🛑
import axios from 'axios'; 
import { useTranslation } from 'react-i18next';
// 🛑 Import useNavigate for auth redirect 🛑
import { useNavigate } from 'react-router-dom'; 

// Use the dynamic API URL from the environment
const API_URL = 'https://enchanting-upliftment-production.up.railway.app/api';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate(); // Initialize useNavigate
    
    // ... rest of your state declarations ...
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

    // 🎯 NEW: Create the Authenticated Axios Instance 🎯
    const getAuthClient = () => {
        const token = localStorage.getItem('token');
        
        // If token is missing, redirect to login page immediately
        if (!token) {
            navigate('/admin');
            return null;
        }

        return axios.create({
            baseURL: API_URL,
            headers: {
                // Attach the JWT to the Authorization header
                'Authorization': `Bearer ${token}` 
            }
        });
    };

    // --- Data Fetching ---
    const fetchProjects = async () => {
        const client = getAuthClient();
        if (!client) return; // Stop if no token

        setLoading(true);
        try {
            // 🛑 USE THE AUTHENTICATED CLIENT 🛑
            const response = await client.get('/projects'); 
            setProjects(response.data);
        } catch (err) {
            console.error("Error fetching projects:", err);
            // If server rejects (401 Unauthorized), redirect to login
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
        // The dependency array is empty, so it runs only once on mount
    }, []); 

    // --- Form Handlers ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const client = getAuthClient();
        if (!client) return; // Stop if no token

        setStatusMessage('Processing...');
        
        try {
            if (isEditing) {
                // UPDATE logic (PUT request)
                await client.put(`/projects/${currentProject._id}`, formData);
                setStatusMessage(`SUCCESS: Project updated!`);
            } else {
                // CREATE logic (POST request)
                await client.post('/projects', formData);
                setStatusMessage(`SUCCESS: Project added!`);
            }
            
            // ... reset form state ...
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
        if (!client) return; // Stop if no token

        setStatusMessage('Deleting project...');
        try {
            await client.delete(`/projects/${id}`);
            setStatusMessage('SUCCESS: Project deleted.');
            fetchProjects(); // Refresh the list
        } catch (error) {
            setStatusMessage('ERROR: Failed to delete project.');
        }
    };

    // ... handleEdit logic remains the same ...
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
    // 🛑 Final check: If no token is present, we should not render the dashboard 🛑
    if (!localStorage.getItem('token')) {
        return <div className="container">Redirecting to login...</div>;
    }
    if (loading) return <div className="container">Loading dashboard...</div>;

    return (
        // ... rest of the render code (form and table) ...
        <div className="container admin-container">
            {/* ... rest of the form and table ... */}
            <h2 className="page-header">{isEditing ? "Edit Project" : "Add New Project"}</h2>
            {statusMessage && <p className={`status-message ${statusMessage.startsWith('SUCCESS') ? 'success' : 'error'}`}>{statusMessage}</p>}
            
            {/* The submission/edit form */}
            <form onSubmit={handleFormSubmit} className="project-form">
                {/* ... form inputs ... */}
                <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} required />
                <textarea name="descriptionEn" placeholder="English Description" value={formData.descriptionEn} onChange={handleChange} required />
                <textarea name="descriptionFr" placeholder="Description Française" value={formData.descriptionFr} onChange={handleChange} required />
                <input type="url" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required />
                <input type="url" name="link" placeholder="Live Link or GitHub URL (Optional)" value={formData.link} onChange={handleChange} />

                <button type="submit" className="submit-button">
                    {isEditing ? "Save Changes" : "Add Project"}
                </button>
                {isEditing && (
                    <button 
                        type="button" 
                        onClick={() => { setIsEditing(false); setFormData({ title: '', descriptionEn: '', descriptionFr: '', imageUrl: '', link: '' }); }}
                        className="cancel-button"
                    >
                        Cancel Edit
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
                            <th>Link</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project._id}>
                                <td>{project.title}</td>
                                <td><a href={project.link} target="_blank" rel="noopener noreferrer">View</a></td>
                                <td className="action-buttons">
                                    <button onClick={() => handleEdit(project)} className="edit-button">Edit</button>
                                    <button onClick={() => handleDelete(project._id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default AdminDashboard;