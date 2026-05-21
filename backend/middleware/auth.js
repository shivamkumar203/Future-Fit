// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');

// This function is our "gatekeeper"
module.exports = async function(req, res, next) {
    // 1. Get token from the header
    const token = req.header('x-auth-token');

    // 2. Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied. Please log in.' });
    }

    // 3. Verify token
    try {
        // Decode the token to get the user's ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add the user's ID to the request object
        // so our API routes can know *who* is making the request
        req.user = decoded.user;

        // Check if user still exists (optional but good practice)
        const user = await User.findById(req.user.id);
        if (!user) {
             return res.status(401).json({ msg: 'Token is valid, but user no longer exists.' });
        }

        // Let the request continue to its destination
        next();

    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid.' });
    }
};