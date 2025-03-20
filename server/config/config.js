import dotenv from "dotenv";

dotenv.config();

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
