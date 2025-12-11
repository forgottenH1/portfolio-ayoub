// server/server.js 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 🎯 FIX 1: Make the PORT dynamic for Render and use 5000 as local fallback 🎯
const PORT = process.env.PORT || 8080;

// --- CORS Configuration (Middleware) ---
// 🎯 FIX 2: Allow all origins (temporary) for easy deployment configuration 🎯
// Render automatically provides the PORT and expects the app to bind to it.
const corsOptions = {
    // We replace the specific local origin with a wildcard '*' 
    // to allow the Render frontend to access the Render backend.
    origin: '*', 
    optionsSuccessStatus: 200 
}
app.use(cors(corsOptions)); // Apply CORS here

// Middleware (Allows the app to read JSON)
app.use(express.json());


// Database Connection
// Ensure your MONGODB_URI environment variable is set in Render
mongoose.connect(process.env.MONGODB_URI) 
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("Could not connect to MongoDB Atlas!", err));


// --- API ROUTES ENTRY POINT ---
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);


// A simple root test route
app.get('/', (req, res) => {
    res.send("Hello Ayoub! The Backend is running.");
});


// Start the Server
// 🎯 FIX 3: Use the dynamic PORT variable 🎯
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));