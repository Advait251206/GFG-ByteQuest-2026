const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/silent-disease', {
      // mongoose 6+ defaults are fine
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log("Running in offline/mock mode (DB connection failed)");
    // process.exit(1); // Don't exit, allow mock mode
  }
};

module.exports = connectDB;
