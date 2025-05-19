/**
 * Application configuration module
 * @module config
 */

import dotenv from "dotenv";

dotenv.config();

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
 */
export default {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_S3_BUCKET,
  },
};
