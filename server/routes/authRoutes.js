// server/routes/authRoutes.js - FINAL SECURE VERSION

// --- CRITICAL FIX: Initialize Express Router ---
const express = require('express');
const router = express.Router(); 

// --- Dependencies for Auth Logic ---
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
// 🛑 CRITICAL SECURITY ADDITION: Use bcryptjs for secure password hashing 🛑
const bcrypt = require('bcryptjs'); 


// --- 1. REGISTRATION LOGIC (Now SECURE) ---
router.post('/register', async (req, res) => {
    // 🛑 1. INPUT VALIDATION 🛑
    const { username, password } = req.body;

    if (!username || !password) {
        console.error("REGISTRATION FAILED: Missing username or password in request body.");
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // 🛑 2. SECURITY CHECK: BLOCK PUBLIC REGISTRATION AFTER FIRST USER 🛑
        const userCount = await User.countDocuments();
        
        if (userCount > 0) {
            console.log("SECURITY BLOCKED: Public registration is closed.");
            return res.status(403).json({ message: "Registration is closed. An administrator already exists." });
        }
        // If we reach here, this is the very first user creation.
        
        // 3. Check if username already exists
        let user = await User.findOne({ username });
        if (user) {
            console.log(`REGISTRATION FAILED: User ${username} already exists.`);
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // 🛑 4. CRITICAL SECURITY IMPROVEMENT: HASH THE PASSWORD 🛑
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 5. Create the new User object
        user = new User({
            username,
            password: hashedPassword, // Store the hashed password
        });

        // 6. Save the new User to the database
        await user.save();

        console.log(`SUCCESS: User ${username} registered successfully.`);
        res.status(201).json({ message: 'User registered successfully. Proceed to login.' }); 

    } catch (error) {
        // CRITICAL ERROR LOGGING
        console.error("REGISTRATION ERROR (Mongoose/Server):", error.message);
        res.status(500).json({ message: 'Server error during registration. Check backend logs for details.' });
    }
});


// --- 2. LOGIN LOGIC (Now SECURE) ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // A. Find the user (must select the password for comparison)
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        // 🛑 B. CRITICAL SECURITY IMPROVEMENT: COMPARE HASHED PASSWORD 🛑
        // Note: This assumes existing users were created without hashing,
        // which might break login for old users. You should delete all existing users
        // and re-register with the new secured system.
        let isMatch;
        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch (e) {
            // Fallback for plain-text password check IF bcrypt fails (for migration), 
            // but this is highly discouraged for production.
            isMatch = (password === user.password); 
            console.warn("WARNING: Login used plain text fallback. User password needs to be re-hashed.");
        }


        console.log(`Login attempt for ${username}: Match=${isMatch}`); 

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        // C. Generate the JWT Token 
        const payload = { userId: user.id };
        const token = jwt.sign(
            payload, 
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