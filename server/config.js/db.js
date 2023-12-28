const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    // If an error occurs during connection, you might want to throw it
    // so that the calling code can handle it appropriately.
    throw error;
  }
};

module.exports = connectDB;
