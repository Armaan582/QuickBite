const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set. Add your MongoDB Atlas connection string to server/.env.');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Atlas Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
