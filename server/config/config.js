/**
 * Application configuration module
 * @module config
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, "../.env") });

// Validate required environment variables
const requiredEnvVars = ["GEMINI_API_KEY"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars);
  console.error("Please check your .env file in the server directory");
}

/**
 * Application configuration object
 * @type {Object}
 * @property {string} mongoUri - MongoDB connection URI
 * @property {number} port - Server port number (defaults to 5000)
 * @property {string} jwtSecret - Secret key for JWT token generation
 * @property {Object} aws - AWS configuration
 * @property {string} aws.accessKeyId - AWS access key ID
 * @property {string} aws.secretAccessKey - AWS secret access key
 * @property {string} aws.region - AWS region
 * @property {string} aws.bucket - S3 bucket name
 * @property {string} geminiApiKey - Gemini API key for AI chat functionality
 */
export default {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  geminiApiKey: process.env.GEMINI_API_KEY,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_S3_BUCKET,
  },
};
