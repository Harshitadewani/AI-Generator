const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require("@google/genai"); // Using the new SDK you suggested
const History = require('../models/History');
require('dotenv').config();

// Initialize the new AI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// @route   POST api/generator/generate
router.post('/generate', async (req, res) => {
    const { prompt, technology, user_id } = req.body;
    
    if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: "Describe your component first" });
    }

    try {
        console.log("🚀 Generating with new SDK and Premium Prompt...");
        
        // Using stable model to avoid the 503 "High Demand" error on preview models
        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash", 
          contents: `
You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}
Framework to use: ${technology}

Requirements:
- The code must be clean, well-structured, and easy to understand.
- Optimize for SEO where applicable.
- Focus on creating a modern, animated, and responsive UI design.
- Include high-quality hover effects, shadows, animations, colors, and typography.
- Return ONLY the code, formatted properly in Markdown fenced code blocks.
- Do NOT include explanations, text, comments, or anything else besides the code.
- And give the whole code in a single HTML file if possible.
          `,
        });

        let responseText = response.text;

        if (!responseText) {
            throw new Error("Empty response from AI");
        }

        // Cleanse markdown markers if any
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
        console.error("AI Generation Error:", err.message);
        res.status(500).json({ 
            message: 'Something went wrong while generating code', 
            details: err.message 
        });
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
