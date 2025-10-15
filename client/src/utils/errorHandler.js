/**
 * Centralized error handling utility
 * @module errorHandler
 */

/**
 * Error types enumeration
 * @enum {string}
 */
export const ErrorType = {
  NETWORK: "NETWORK",
  VALIDATION: "VALIDATION",
  AUTHENTICATION: "AUTHENTICATION",
  AUTHORIZATION: "AUTHORIZATION",
  NOT_FOUND: "NOT_FOUND",
  SERVER: "SERVER",
  UNKNOWN: "UNKNOWN",
};

/**
 * Determines error type from error object
 * @param {Error|Object} error - Error object
 * @returns {string} Error type
 */
export const getErrorType = (error) => {
  if (!error.response) {
    return ErrorType.NETWORK;
  }

  const status = error.response?.status;

  switch (status) {
    case 400:
      return ErrorType.VALIDATION;
    case 401:
      return ErrorType.AUTHENTICATION;
    case 403:
      return ErrorType.AUTHORIZATION;
    case 404:
      return ErrorType.NOT_FOUND;
    case 500:
    case 502:
    case 503:
      return ErrorType.SERVER;
    default:
      return ErrorType.UNKNOWN;
  }
};

/**
 * Extracts user-friendly error message
 * @param {Error|Object} error - Error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  // Check for validation errors with detailed field messages
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const fieldErrors = error.response.data.errors
      .map(err => `${err.field}: ${err.message}`)
      .join(', ');
    return fieldErrors;
  }

  // Check for custom error messages
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  const errorType = getErrorType(error);

  const errorMessages = {
    [ErrorType.NETWORK]:
      "Network error. Please check your internet connection and try again.",
    [ErrorType.VALIDATION]:
      "Invalid input. Please check your data and try again.",
    [ErrorType.AUTHENTICATION]: "Authentication failed. Please log in again.",
    [ErrorType.AUTHORIZATION]:
      "You do not have permission to perform this action.",
    [ErrorType.NOT_FOUND]: "The requested resource was not found.",
    [ErrorType.SERVER]: "Server error. Please try again later.",
    [ErrorType.UNKNOWN]: "An unexpected error occurred. Please try again.",
  };

  return errorMessages[errorType] || errorMessages[ErrorType.UNKNOWN];
};

/**
 * Logs error to console in development
 * @param {Error|Object} error - Error object
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = "") => {
  if (import.meta.env.DEV) {
    console.error(`[Error ${context ? `in ${context}` : ""}]:`, {
      message: error.message,
      type: getErrorType(error),
      response: error.response?.data,
      stack: error.stack,
    });
  }
};

/**
 * Handles async errors with consistent error handling
 * @param {Function} asyncFunction - Async function to execute
 * @param {string} context - Context for error logging
 * @returns {Promise<[Error|null, any]>} Tuple of [error, data]
 * @example
 * const [error, data] = await handleAsync(fetchPosts, 'fetchPosts');
 * if (error) {
 *   // Handle error
 * }
 */
export const handleAsync = async (asyncFunction, context = "") => {
  try {
    const data = await asyncFunction();
    return [null, data];
  } catch (error) {
    logError(error, context);
    return [error, null];
  }
};

/**
 * Creates a standardized error response
 * @param {Error|Object} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {Object} Standardized error response
 */
export const createErrorResponse = (error, context = "") => {
  const errorType = getErrorType(error);
  const message = getErrorMessage(error);

  return {
    success: false,
    error: {
      type: errorType,
      message,
      context,
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Retry mechanism for failed requests
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise<any>} Result of function
 */
export const retryAsync = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
};
