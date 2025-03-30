const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        // Log incoming request to help diagnose issues
        console.log('Profile update request received for user:', req.user.userId);
        
        const { name, bio, skills, availability, profileImage, experience, location } = req.body;
        
        // Find the user first
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update only the fields that are provided
        if (name !== undefined) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (skills !== undefined) user.skills = skills;
        if (availability !== undefined) user.availability = availability;
        if (experience !== undefined) user.experience = experience;
        if (location !== undefined) user.location = location;

        // Handle profile image separately (it can be large)
        if (profileImage) {
            try {
                user.profileImage = profileImage;
            } catch (imageError) {
                console.error('Error processing profile image:', imageError);
                return res.status(400).json({ 
                    message: 'Invalid profile image format',
                    error: imageError.message 
                });
            }
        }

        // Save the user with error handling
        try {
            await user.save();
            // Return sanitized user object (without sensitive info)
            const sanitizedUser = user.toObject();
            delete sanitizedUser.password;
            res.json(sanitizedUser);
        } catch (saveError) {
            console.error('Error saving user profile:', saveError);
            return res.status(500).json({ 
                message: 'Error saving profile', 
                error: saveError.message 
            });
        }
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            message: 'Server error processing profile update', 
            error: error.message 
        });
    }
});

// Get skill matches
router.get('/matches', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const { skillName, level } = req.query;

        let query = {
            _id: { $ne: user._id },
            skills: {
                $elemMatch: {
                    name: skillName,
                    level: level
                }
            }
        };

        const matches = await User.find(query)
            .select('name email skills bio rating completedSessions')
            .limit(10);

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all users (for search)
router.get('/', auth, async (req, res) => {
    try {
        const { search, skill } = req.query;
        let query = { _id: { $ne: req.user.userId } };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (skill) {
            query['skills.name'] = { $regex: skill, $options: 'i' };
        }

        const users = await User.find(query)
            .select('name email skills bio rating completedSessions')
            .limit(20);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 