import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database
 * @async
 * @function connectDb
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} If connection fails
 * @example
 * // In your main application file
 * import connectDb from './config/db';
 *
 * try {
 *   await connectDb();
 *   console.log('Database connected successfully');
 * } catch (error) {
 *   console.error('Database connection failed:', error);
 * }
 */
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

export default connectDb;
