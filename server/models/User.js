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
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpire: {
    type: Date,
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
 * Generates a password reset token
 * @method
 * @returns {string} Reset token (unhashed version to send to user)
 * @example
 * const user = await User.findOne({ email: 'user@example.com' });
 * const resetToken = user.getResetPasswordToken();
 * await user.save();
 */
UserSchema.methods.getResetPasswordToken = function () {
  // Generate random token
  const resetToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = bcrypt.hashSync(resetToken, 10);

  // Set expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

/**
 * Generates an email verification token
 * @method
 * @returns {string} Verification token (unhashed version to send to user)
 * @example
 * const user = new User({ email: 'user@example.com', ... });
 * const verifyToken = user.getEmailVerificationToken();
 * await user.save();
 */
UserSchema.methods.getEmailVerificationToken = function () {
  // Generate random token
  const verifyToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = bcrypt.hashSync(verifyToken, 10);

  // Set expire time (24 hours)
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return verifyToken;
};

/**
 * User model
 * @type {mongoose.Model}
 */
const User = mongoose.model("User", UserSchema);
export default User;
