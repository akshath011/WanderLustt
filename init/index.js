const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing');

//DATABASE SEEDING CODE
const MONGO_URI = 'mongodb://127.0.0.1:27017/WanderLustt';

main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect(MONGO_URI);    
}
// DATABASE SEEDING CODE ENDS HERE
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner:'69b80973088602f4630ff53c',
    }));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
}


initDB();

