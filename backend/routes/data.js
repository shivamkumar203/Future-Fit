// routes/data.js (Complete File - WITH Book Session)..

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import our auth middleware
const User = require('../models/user'); // Import the User model

// --- 1. SAVE ASSESSMENT RESULTS ---
// (No changes here)
router.post('/save-assessment', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.assessmentResult = req.body.results;
        await user.save();
        res.json({ msg: 'Assessment results saved successfully!', assessmentResult: user.assessmentResult });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 2. GET DASHBOARD DATA (FOR GROWTH.HTML) ---
// (No changes here)
router.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({
            assessmentResult: user.assessmentResult,
            savedColleges: user.savedColleges,
            appliedJobs: user.appliedJobs,
            bookedSessions: user.bookedSessions
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 3. SAVE A COLLEGE ---
// (No changes here - but I've updated the logic slightly to be safer)
router.post('/save-college', auth, async (req, res) => {
    try {
        const { collegeName, isSaving } = req.body; // Get both name and action
        if (!collegeName) {
            return res.status(400).json({ msg: 'College name is required' });
        }

        const user = await User.findById(req.user.id);

        if (isSaving) {
            // Add to array only if it's not already there
            if (!user.savedColleges.includes(collegeName)) {
                user.savedColleges.push(collegeName);
            }
        } else {
            // Remove from array
            user.savedColleges = user.savedColleges.filter(name => name !== collegeName);
        }
        
        await user.save();
        res.json({ savedColleges: user.savedColleges });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- ⭐ 4. NEW: BOOK A MENTOR SESSION ---
// @route   POST /api/data/book-session
// @desc    Save a mentor session to the user's list
// @access  Private
router.post('/book-session', auth, async (req, res) => {
    try {
        const { mentorName } = req.body;
        if (!mentorName) {
            return res.status(400).json({ msg: 'Mentor name is required' });
        }

        const user = await User.findById(req.user.id);
        
        // Add to array only if it's not already there
        if (!user.bookedSessions.includes(mentorName)) {
            user.bookedSessions.push(mentorName);
            await user.save();
        }

        res.json({ bookedSessions: user.bookedSessions });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// --- ⭐ 5. NEW: APPLY TO JOB ---
// @route   POST /api/data/apply-job
// @desc    Save a job application to the user's list
router.post('/apply-job', auth, async (req, res) => {
    try {
        const { jobTitle } = req.body;
        if (!jobTitle) {
            return res.status(400).json({ msg: 'Job title is required' });
        }

        const user = await User.findById(req.user.id);
        
        // Add to array only if it's not already there
        if (!user.appliedJobs.includes(jobTitle)) {
            user.appliedJobs.push(jobTitle);
            await user.save();
        }

        res.json({ appliedJobs: user.appliedJobs });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;