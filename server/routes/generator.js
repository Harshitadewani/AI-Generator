const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const History = require('../models/History');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyA917qQC6bNUL0x90ru0LaSTH08vMomaUk");

// @route   POST api/generator/generate
router.post('/generate', async (req, res) => {
    const { prompt, technology, user_id } = req.body;
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const promptText = `Act as an expert developer. Tech: ${technology}. User: ${prompt}. Return ONLY the raw code. No markdown code blocks unless requested.`;
        
        const result = await model.generateContent(promptText);
        let responseText = result.response.text();
        // cleanse
        responseText = responseText.replace(/```(?:html|jsx|js|css|tsx|ts|javascript|react)?\n/ig, '').replace(/```\s*$/g, '');
        
        // Save to History (if user logged in)
        if (user_id) {
            await History.create({
                user: user_id,
                prompt,
                code: responseText,
                technology
            });
        }
        res.json({ code: responseText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'AI generation error', error: err.message });
    }
});

// @route   GET api/generator/history/:user_id
router.get('/history/:user_id', async (req, res) => {
    try {
        const history = await History.find({ user: req.params.user_id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'History retrieval error' });
    }
});

module.exports = router;
