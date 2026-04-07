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
        if (error.message.includes('Authentication failed')) {
            console.error("💡 TIP: Aapka MongoDB username/password mismatch ho raha hai. Render Dashboard mein MONGO_URI ko re-check aur update karein.");
        } else if (error.message.includes('IP not in whitelist')) {
            console.error("💡 TIP: MongoDB Atlas mein Network Access (0.0.0.0/0) allow karein.");
        }
        process.exit(1);
    }
};

module.exports = connectDB;
