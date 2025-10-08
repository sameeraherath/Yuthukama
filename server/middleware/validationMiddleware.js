/**
 * Validation middleware module using express-validator
 * @module validationMiddleware
 */

import { body, param, validationResult } from "express-validator";

/**
 * Middleware to handle validation errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for user registration
 * @type {Array}
 */
export const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .escape(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .toLowerCase(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  handleValidationErrors,
];

/**
 * Validation rules for user login
 * @type {Array}
 */
export const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .toLowerCase(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

/**
 * Validation rules for creating a post
 * @type {Array}
 */
export const validateCreatePost = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters")
    .escape(),
  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category must not exceed 50 characters")
    .escape(),
  handleValidationErrors,
];

/**
 * Validation rules for updating a post
 * @type {Array}
 */
export const validateUpdatePost = [
  param("id").isMongoId().withMessage("Invalid post ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters")
    .escape(),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters")
    .escape(),
  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category must not exceed 50 characters")
    .escape(),
  handleValidationErrors,
];

/**
 * Validation rules for creating a comment
 * @type {Array}
 */
export const validateComment = [
  param("postId").isMongoId().withMessage("Invalid post ID"),
  body("text")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be between 1 and 1000 characters")
    .escape(),
  handleValidationErrors,
];

/**
 * Validation rules for MongoDB ID parameters
 * @type {Array}
 */
export const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  handleValidationErrors,
];

/**
 * Validation rules for updating user profile
 * @type {Array}
 */
export const validateUpdateProfile = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .escape(),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters")
    .escape(),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location must not exceed 100 characters")
    .escape(),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("skills.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each skill must not exceed 50 characters")
    .escape(),
  handleValidationErrors,
];

/**
 * Validation rules for password change
 * @type {Array}
 */
export const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Password confirmation does not match"),
  handleValidationErrors,
];

/**
 * Validation rules for forgot password
 * @type {Array}
 */
export const validateForgotPassword = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .toLowerCase(),
  handleValidationErrors,
];

/**
 * Validation rules for reset password
 * @type {Array}
 */
export const validateResetPassword = [
  param("resetToken").notEmpty().withMessage("Reset token is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password confirmation does not match"),
  handleValidationErrors,
];

/**
 * Validation rules for sending a message
 * @type {Array}
 */
export const validateMessage = [
  body("text")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Message must be between 1 and 2000 characters")
    .escape(),
  body("recipient").optional().isMongoId().withMessage("Invalid recipient ID"),
  handleValidationErrors,
];
