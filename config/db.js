const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    try {
        // Check if already connected
        if (isConnected && mongoose.connection.readyState === 1) {
            return;
        }

        if (mongoose.connection.readyState === 1) {
            isConnected = true;
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        isConnected = false;
        throw error;
    }
};

module.exports = connectDB;
