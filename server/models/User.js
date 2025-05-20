/**
 * User model module
 * @module models/User
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Mongoose schema for User model
 * @type {mongoose.Schema}
 * @property {string} username - User's unique username
 * @property {string} email - User's unique email address
 * @property {string} password - User's hashed password
 * @property {string} role - User's role (user/admin)
 * @property {string} profilePicture - URL to user's profile picture
 * @property {Date} createdAt - Timestamp of user creation
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profilePicture: {
    type: String,
    default: "/uploads/profile-pics/default.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Pre-save middleware to hash password before saving
 * @param {Function} next - Mongoose next middleware function
 * @returns {Promise<void>}
 */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a provided password with the user's hashed password
 * @method
 * @param {string} enteredPassword - The password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 * @example
 * const user = await User.findOne({ email: 'user@example.com' });
 * const isMatch = await user.matchPassword('password123');
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * User model
 * @type {mongoose.Model}
 */
const User = mongoose.model("User", UserSchema);
export default User;
