const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all chats for a user
router.get('/', auth, async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.user.userId
        })
        .populate('participants', 'name email avatar')
        .sort({ lastMessage: -1 });

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get or create chat with another user
router.get('/:userId', auth, async (req, res) => {
    try {
        let chat = await Chat.findOne({
            participants: { $all: [req.user.userId, req.params.userId] }
        }).populate('participants', 'name email avatar');

        if (!chat) {
            chat = new Chat({
                participants: [req.user.userId, req.params.userId]
            });
            await chat.save();
            chat = await chat.populate('participants', 'name email avatar');
        }

        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Send message in a chat
router.post('/:chatId/messages', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const chat = await Chat.findById(req.params.chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (!chat.participants.includes(req.user.userId)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        chat.messages.push({
            sender: req.user.userId,
            content
        });

        chat.lastMessage = new Date();
        await chat.save();

        const populatedChat = await chat.populate('participants', 'name email avatar');
        res.json(populatedChat);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Mark messages as read
router.put('/:chatId/read', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        chat.messages.forEach(message => {
            if (message.sender.toString() !== req.user.userId && !message.read) {
                message.read = true;
            }
        });

        await chat.save();
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 