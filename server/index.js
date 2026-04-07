const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
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
