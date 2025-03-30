const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all available skills
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({}, 'skills');
        const allSkills = new Set();
        
        users.forEach(user => {
            user.skills.forEach(skill => {
                allSkills.add(skill.name);
            });
        });

        res.json(Array.from(allSkills));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get users by skill
router.get('/:skillName', auth, async (req, res) => {
    try {
        const users = await User.find({
            'skills.name': req.params.skillName,
            _id: { $ne: req.user.userId }
        }).select('name email skills bio rating completedSessions');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add skill to user profile
router.post('/user', auth, async (req, res) => {
    try {
        const { name, level, description } = req.body;
        const user = await User.findById(req.user.userId);

        // Check if skill already exists
        const existingSkill = user.skills.find(skill => skill.name === name);
        if (existingSkill) {
            return res.status(400).json({ message: 'Skill already exists in profile' });
        }

        user.skills.push({ name, level, description });
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update skill in user profile
router.put('/user/:skillName', auth, async (req, res) => {
    try {
        const { level, description } = req.body;
        const user = await User.findById(req.user.userId);

        const skill = user.skills.find(skill => skill.name === req.params.skillName);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        if (level) skill.level = level;
        if (description) skill.description = description;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Remove skill from user profile
router.delete('/user/:skillName', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        user.skills = user.skills.filter(skill => skill.name !== req.params.skillName);
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 