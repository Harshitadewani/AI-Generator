const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// CORS Configuration
const allowedOrigins = process.env.CLIENT_URL 
    ? process.env.CLIENT_URL.split(',') 
    : ['http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow local development
        if (!origin || origin.startsWith('http://localhost')) {
            return callback(null, true);
        }

        const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
        
        // Allow production URL and ANY vercel deployment preview
        const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true
}));
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/generator', require('./routes/generator'));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('AI Code Generator API is running...');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
