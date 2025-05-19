/**
 * Global error handling middleware for Express applications
 * @module errorHandler
 */

/**
 * Handles errors in the application and sends appropriate response
 * @param {Error} err - The error object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing error details
 * @example
 * // In Express app
 * app.use((err, req, res, next) => {
 *   errorHandler(err, res);
 * });
 */
const errorHandler = (err, res) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler };
