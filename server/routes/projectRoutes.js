// server/routes/projectRoutes.js - FIXED VERSION WITH AUTH AND DEBUGGING
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const jwt = require('jsonwebtoken'); // Need jwt for verification

// ----------------------------------------------------------------------
// 🎯 CRITICAL FIX: AUTHENTICATION MIDDLEWARE WITH DEBUGGING 🎯
// ----------------------------------------------------------------------

const protect = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("TOKEN FAILURE: No Authorization header or malformed.");
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 1. Verify the token using the same secret key used for signing
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        
        // 2. Attach the user payload to the request
        req.userId = decoded.userId;
        
        // 3. Token is valid, continue to the next handler
        console.log("TOKEN SUCCESS: User ID", req.userId);
        next();
    } catch (err) {
        // 🎯 CRITICAL DEBUG LOGS: THIS WILL TELL US THE PROBLEM 🎯
        console.error("TOKEN VERIFICATION FAILED:", err.message);
        console.error("JWT_SECRET Length:", process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'undefined');
        
        // 4. Token is invalid or expired
        return res.status(401).json({ message: `Token is not valid or expired: ${err.message}` });
    }
};


// ----------------------------------------------------------------------
// 🎯 PROTECTED ROUTES 🎯
// ----------------------------------------------------------------------

// GET all projects (Public Route - usually fine without auth, but we'll protect the CRUD ones)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ _id: -1 }); // Display newest first
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new project (PROTECTED)
router.post('/', protect, async (req, res) => {
    // Note: The logic here is not fully secure (no input validation or role check)
    // but the authentication is handled by `protect` middleware.
    const project = new Project(req.body);

    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (Update) a project (PROTECTED)
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a project (PROTECTED)
router.delete('/:id', protect, async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;