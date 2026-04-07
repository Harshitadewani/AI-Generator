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
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
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
