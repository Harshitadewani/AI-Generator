const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-generator';
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, 
        });
        console.log(`✅ MongoDB Active: ${conn.connection.host} (${conn.connection.name})`);
    } catch (error) {
        console.error(`❌ Connection Failed: ${error.message}`);
        console.error("Check your MONGO_URI in Render dashboard and Atlas Network Access!");
        process.exit(1);
    }
};

module.exports = connectDB;
