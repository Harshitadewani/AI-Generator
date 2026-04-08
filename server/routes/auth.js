const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'yoursecretkey', { expiresIn: '30d' });
};

// @route   POST api/auth/register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ email, password });
        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Account not found. Please Sign Up first.' });
        }
        
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }
    } catch (err) {
        console.error("Login Server Error:", err.message);
        res.status(500).json({ message: 'Internal Server Error during Login' });
    }
});

module.exports = router;
