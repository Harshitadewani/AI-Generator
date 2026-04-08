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
        if (!process.env.GEMINI_API_KEY && !process.env.DEFAULT_KEY) {
             // Just a safety check
        }
        
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
        
        const promptText = `Act as an expert developer. Tech: ${technology}. User: ${prompt}. Return ONLY the raw code. No markdown code blocks unless requested.`;

        for (const modelName of modelsToTry) {
            try {
                console.log(`🚀 Final Attempt with: ${modelName}`);
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
                    return res.status(500).json({ message: 'Invalid Gemini API Key. Please update it on Render dashboard.' });
                }
                continue;
            }
        }

        if (!responseText) {
            return res.status(500).json({ 
                message: 'All AI models are currently busy or unavailable. Please try again in 30 seconds.',
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
        res.status(500).json({ message: 'Internal Server Error' });
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
