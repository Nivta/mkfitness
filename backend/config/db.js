const mongoose = require('mongoose');

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log('MongoDB connection error: ', err);
    }
}

module.exports = connectToDB;
