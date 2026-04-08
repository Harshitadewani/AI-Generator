const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const History = require('../models/History');
require('dotenv').config();

// Helper to initialize AI with specific version
const initAI = (key) => {
    // Forcing 'v1' stable API to avoid 404 in certain regions
    return new GoogleGenerativeAI(key);
};

// @route   POST api/generator/generate
router.post('/generate', async (req, res) => {
    const { prompt, technology, user_id } = req.body;
    
    try {
        const rawKey = process.env.GEMINI_API_KEY || "";
        const apiKey = rawKey.trim();
        
        if (!apiKey) {
            return res.status(500).json({ message: 'GEMINI_API_KEY is not configured on Render.' });
        }

        const genAI = initAI(apiKey);
        let responseText = "";
        let finalModelUsed = "";
        
        // Using stable model IDs for v1 API
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        const promptText = `Act as an expert developer. Tech: ${technology}. User: ${prompt}. Return ONLY the raw code. No markdown code blocks unless requested.`;

        for (const modelName of modelsToTry) {
            try {
                console.log(`🚀 Final Stable Attempt with: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(promptText);
                const response = await result.response;
                responseText = response.text();
                
                if (responseText) {
                    finalModelUsed = modelName;
                    break; 
                }
            } catch (err) {
                console.error(`❌ ${modelName} failed:`, err.message);
                continue; 
            }
        }

        if (!responseText) {
            return res.status(500).json({ 
                message: 'AI Service currently unavailable (Stable API failed). Check Render Logs for details.',
                error: 'All models failed'
            });
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

// Test route to debug AI specifically
router.get('/ai-test', async (req, res) => {
    try {
        const apiKey = (process.env.GEMINI_API_KEY || "").trim();
        if (!apiKey) return res.json({ error: 'API Key missing' });
        
        const genAI = initAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you active? Reply 'YES'.");
        const response = await result.response;
        res.json({ success: true, model: "gemini-1.5-flash", response: response.text() });
    } catch (err) {
        res.json({ success: false, error: err.message });
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
