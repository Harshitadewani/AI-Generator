const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const History = require('../models/History');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST api/generator/generate
router.post('/generate', async (req, res) => {
    const { prompt, technology, user_id } = req.body;
    
    try {
        // Ensure API Key exists
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'GEMINI_API_KEY is not configured on the server.' });
        }
        
        const apiKey = process.env.GEMINI_API_KEY;
        console.log(`Using API Key (last 4): ...${apiKey.slice(-4)}`);
        
        let responseText = "";

        // Attempt 1: Requested Gemini 3 Flash Preview
        try {
            console.log("Attempting Gemini 3 Flash Preview...");
            const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
            const promptText = `Act as an expert developer. Tech: ${technology}. User: ${prompt}. Return ONLY the raw code. No markdown code blocks unless requested.`;
            const result = await model.generateContent(promptText);
            responseText = result.response.text();
        } catch (f1) {
            console.error("Gemini 3 failed, trying 1.5 Flash fallback...", f1.message);
            // Attempt 2: Stable Fallback
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const promptText = `Act as an expert developer. Tech: ${technology}. User: ${prompt}. Return ONLY the raw code. No markdown code blocks unless requested.`;
                const result = await model.generateContent(promptText);
                responseText = result.response.text();
            } catch (f2) {
                console.error("All models failed:", f2.message);
                return res.status(500).json({ 
                    message: 'Gemini API Error (Both models failed)', 
                    details: f2.message 
                });
            }
        }
        
        // Cleanse code blocks
        responseText = responseText.replace(/```(?:html|jsx|js|css|tsx|ts|javascript|react)?\n/ig, '').replace(/```\s*$/g, '');
        
        // Save to History (background)
        if (user_id && responseText) {
            History.create({
                user: user_id,
                prompt,
                code: responseText,
                technology
            }).catch(e => console.error("History fail:", e.message));
        }

        res.json({ code: responseText });
    } catch (err) {
        console.error("Fatal Generation Error:", err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
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
