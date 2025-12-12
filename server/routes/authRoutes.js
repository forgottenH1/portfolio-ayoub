// server/routes/authRoutes.js - FIXED REGISTRATION WITH ERROR LOGGING

// ... (imports remain the same) ...

// --- 1. REGISTRATION LOGIC ---
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // 🎯 Step 1: Input Validation Check 🎯
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
        
        // B. Create the new User object (Using plain text password, as previously decided)
        user = new User({
            username,
            password: password, // Store plain text password
        });

        // C. Save the new User to the database
        await user.save();

        // 🎯 Step 2: Successful Registration Response 🎯
        console.log(`SUCCESS: User ${username} registered successfully.`);
        // Note: No JWT token is generated on registration.
        // Redirect logic is typically handled by the frontend after a successful 201 response.
        res.status(201).json({ message: 'User registered successfully. Proceed to login.' }); 

    } catch (error) {
        // 🎯 Step 3: CRITICAL ERROR LOGGING 🎯
        // This will catch any Mongoose validation or saving errors (e.g., connection issue, schema violation)
        console.error("REGISTRATION ERROR (Mongoose/Server):", error.message);
        res.status(500).json({ message: 'Server error during registration. Check backend logs for details.' });
    }
});


// ... (The router.post('/login', ...) section remains the same) ...