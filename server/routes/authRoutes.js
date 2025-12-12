// server/routes/authRoutes.js - COMPLETE FIXED VERSION

// --- CRITICAL FIX: Initialize Express Router ---
const express = require('express');
const router = express.Router(); // <--- THIS LINE WAS MISSING OR DELETED!

// --- Dependencies for Auth Logic ---
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');

// --- 1. REGISTRATION LOGIC ---
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Step 1: Input Validation Check 
    if (!username || !password) {
        console.error("REGISTRATION FAILED: Missing username or password in request body.");
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // A. Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            console.log(`REGISTRATION FAILED: User ${username} already exists.`);
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // B. Create the new User object
        user = new User({
            username,
            password: password, // Store plain text password
        });

        // C. Save the new User to the database
        await user.save();

        console.log(`SUCCESS: User ${username} registered successfully.`);
        res.status(201).json({ message: 'User registered successfully. Proceed to login.' }); 

    } catch (error) {
        // CRITICAL ERROR LOGGING
        console.error("REGISTRATION ERROR (Mongoose/Server):", error.message);
        res.status(500).json({ message: 'Server error during registration. Check backend logs for details.' });
    }
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

        // B. Check the password (Plain text comparison)
        const isMatch = (password === user.password);

        console.log(`Login attempt for ${username}: Match=${isMatch}`); 

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        // C. Generate the JWT Token (Uses the String() fix)
        const payload = { userId: user.id };
        const token = jwt.sign(
            payload, 
            String(process.env.JWT_SECRET), // Ensure secret is treated as string
            { expiresIn: '1h' }
        );

        res.json({ token, username: user.username });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
});


module.exports = router;