const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// CORS Configuration
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/generator', require('./routes/generator'));

const PORT = process.env.PORT || 5000;

// Status Check Route
app.get('/api/status', (req, res) => {
    res.json({
        server: 'online',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        gemini_key: process.env.GEMINI_API_KEY ? 'is-set' : 'missing'
    });
});

app.get('/', (req, res) => {
    res.send('AI Code Generator API is running...');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
