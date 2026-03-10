import dotenv from "dotenv";
import mongoose from "mongoose";
import { createApp } from "./app.js";

dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_MIN: process.env.ACCESS_TOKEN_MIN,
  REFRESH_TOKEN_DAYS: process.env.REFRESH_TOKEN_DAYS
};

async function startServer() {
  try {
    if (!env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in backend/.env");
    }

    if (!env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET is missing in backend/.env");
    }

    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB connected");

    const app = createApp(env);

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
}

startServer();