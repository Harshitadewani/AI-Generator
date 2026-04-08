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
        const rawKey = process.env.GEMINI_API_KEY || "";
        const apiKey = rawKey.trim();
        
        if (!apiKey) {
            return res.status(500).json({ message: 'GEMINI_API_KEY is not configured on Render.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        let responseText = "";
        let finalModelUsed = "";
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
        
        const promptText = `Act as an expert developer. Tech: ${technology}. User: ${prompt}. Return ONLY the raw code. No markdown code blocks unless requested.`;

        for (const modelName of modelsToTry) {
            try {
                console.log(`🚀 Attempting AI Generation with: ${modelName}`);
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
                if (err.message.includes("API key not valid")) {
                    return res.status(401).json({ message: 'Invalid Gemini API Key. Please check Render Environment Variables.' });
                }
                continue; 
            }
        }

        if (!responseText) {
            return res.status(500).json({ 
                message: 'All AI models failed to respond. Check your API Key permissions in Google AI Studio.',
                error: 'All fallbacks failed'
            });
        }

        console.log(`✅ Generation Successful using: ${finalModelUsed}`);
        
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
