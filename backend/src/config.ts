import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error("FATAL ERROR: JWT secrets are missing in .env");
  process.exit(1);
}

export const {
  NODE_ENV,
  PORT = 3000,
  DB_ADDRESS = "mongodb://127.0.0.1:27017/weblarek",
  UPLOAD_PATH = "images",
  UPLOAD_PATH_TEMP = "temp",
  ORIGIN_ALLOW = "http://localhost:5173",
  AUTH_REFRESH_TOKEN_EXPIRY = "7d",
  AUTH_ACCESS_TOKEN_EXPIRY = "1m",
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} = process.env;