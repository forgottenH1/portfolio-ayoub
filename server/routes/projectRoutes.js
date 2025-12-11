// server/routes/projectRoutes.js - FINAL FIX
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const jwt = require('jsonwebtoken'); 

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
        // 🎯 FINAL FIX 2: Ensure JWT_SECRET is treated as a string for verification 🎯
        const decoded = jwt.verify(token, String(process.env.JWT_SECRET)); 
        
        // 2. Attach the user payload to the request
        req.userId = decoded.userId;
        
        // 3. Token is valid, continue to the next handler
        console.log("TOKEN SUCCESS: User ID", req.userId);
        next();
    } catch (err) {
        // ... (Debug logs remain here to help if the issue is still present) ...
        console.error("TOKEN VERIFICATION FAILED:", err.message);
        console.error("JWT_SECRET Length:", process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'undefined');
        
        // 4. Token is invalid or expired
        return res.status(401).json({ message: `Token is not valid or expired: ${err.message}` });
    }
};


// ----------------------------------------------------------------------
// 🎯 PROTECTED ROUTES (No changes below this line) 🎯
// ----------------------------------------------------------------------

// ... (All router.get, router.post, router.put, router.delete calls remain the same) ...

module.exports = router;