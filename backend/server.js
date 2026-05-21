// server.js (Complete File)

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- Middleware ---
// Enable CORS for frontend connection
app.use(cors()); 
// Body parser to accept JSON data from frontend forms
app.use(express.json()); 

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully.'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// --- Routes ---
app.get('/', (req, res) => res.send('Career Counseling API Running...'));

// Connect the authentication routes
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/data', require('./routes/data'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));