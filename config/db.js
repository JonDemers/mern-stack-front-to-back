const mongoose = require("mongoose");

const db = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.info("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
