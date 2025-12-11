// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// --- Dependencies for Auth Logic ---
const User = require('../models/User'); 
const bcrypt = require('bcrypt'); // Or require('bcrypt')
const jwt = require('jsonwebtoken');

// --- 1. REGISTRATION LOGIC ---
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // A. Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // B. Hash the password
        const salt = await bcrypt.genSalt(10); // Use 10 or whatever your salt rounds are
        const hashedPassword = await bcrypt.hash(password, salt);

        // C. Create and Save the new User
        user = new User({
            username,
            password: hashedPassword,
            // Add a role field here if your schema requires it:
            // role: 'admin'
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully. Proceed to login.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
});


// --- 2. LOGIN LOGIC (Existing Function - Verify it looks similar) ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // A. Find the user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        // B. Check the password
const isMatch = await bcrypt.compare(password, user.password);

// 🎯 ADD THIS DEBUGGING LINE 🎯
console.log(`Login attempt for ${username}: Match=${isMatch}`); 

if (!isMatch) {
    // 🎯 ADD THIS DEBUGGING LINE TO THE ERROR BLOCK 🎯
    console.log(`DEBUG: Failed comparison for ${username}. Stored Hash: ${user.password}`);
    return res.status(400).json({ message: 'Invalid Username or Password' });
}

        // C. Generate the JWT Token
        const payload = { userId: user.id };
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, // Make sure this is in your Railway variables!
            { expiresIn: '1h' }
        );

        res.json({ token, username: user.username });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
});


module.exports = router;