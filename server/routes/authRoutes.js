// server/routes/authRoutes.js - FINAL FIX
const express = require('express');
const router = express.Router();

const User = require('../models/User'); 
const jwt = require('jsonwebtoken');

// --- 1. REGISTRATION LOGIC (No change needed here) ---
// ... (router.post('/register', ...) remains the same) ...
router.post('/register', async (req, res) => {
    // ... (Your existing registration logic) ...
    // ...
});


// --- 2. LOGIN LOGIC ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // A. Find the user
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        // B. Check the password (Plain text comparison remains until fixed)
        const isMatch = (password === user.password); // Direct string comparison

        console.log(`Login attempt for ${username}: Match=${isMatch}`); 

        if (!isMatch) {
            console.log(`DEBUG: Failed comparison for ${username}. Stored Password: ${user.password}`);
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        // C. Generate the JWT Token (The fix is here)
        const payload = { userId: user.id };
        const token = jwt.sign(
            payload, 
            // 🎯 FINAL FIX 1: Ensure JWT_SECRET is treated as a string for signing 🎯
            String(process.env.JWT_SECRET), 
            { expiresIn: '1h' }
        );

        res.json({ token, username: user.username });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;