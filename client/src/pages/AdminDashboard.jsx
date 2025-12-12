import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { useTranslation } from 'react-i18next';

const API_URL = 'http://localhost:5000/api/projects'; 

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    
    // Form data state (includes fields for adding/editing)
    const [formData, setFormData] = useState({
        title: '',
        descriptionEn: '',
        descriptionFr: '',
        imageUrl: '',
        link: ''
    });

    // --- Data Fetching ---
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/projects');
            setProjects(response.data);
        } catch (err) {
            console.error("Error fetching projects:", err);
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
        setStatusMessage('Processing...');
        
        try {
            if (isEditing) {
                // UPDATE logic (PUT request)
                await apiClient.put(`/projects/${currentProject._id}`, formData);
                setStatusMessage(`SUCCESS: Project updated!`);
            } else {
                // CREATE logic (POST request)
                await apiClient.post('/projects', formData);
                setStatusMessage(`SUCCESS: Project added!`);
            }
            
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
        setStatusMessage('Deleting project...');
        try {
            await apiClient.delete(`/projects/${id}`);
            setStatusMessage('SUCCESS: Project deleted.');
            fetchProjects(); // Refresh the list
        } catch (error) {
            setStatusMessage('ERROR: Failed to delete project.');
        }
    };

    const handleEdit = (project) => {
        setIsEditing(true);
        setCurrentProject(project);
        // Load existing data into the form
        setFormData({
            title: project.title,
            descriptionEn: project.descriptionEn,
            descriptionFr: project.descriptionFr,
            imageUrl: project.imageUrl,
            link: project.link
        });
        // Scroll to the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // --- Render Logic ---
    if (loading) return <div className="container">Loading dashboard...</div>;

    return (
        <div className="container admin-container">
            <h2 className="page-header">{isEditing ? "Edit Project" : "Add New Project"}</h2>
            
            {statusMessage && <p className={`status-message ${statusMessage.startsWith('SUCCESS') ? 'success' : 'error'}`}>{statusMessage}</p>}
            
            {/* The submission/edit form */}
            <form onSubmit={handleFormSubmit} className="project-form">
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