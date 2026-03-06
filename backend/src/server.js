require("dotenv").config();
const { connectDB } = require("./config/db");
const { createApp } = require("./app");

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_MIN: Number(process.env.ACCESS_TOKEN_MIN || 30),
  REFRESH_TOKEN_DAYS: Number(process.env.REFRESH_TOKEN_DAYS || 7),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173"
};

async function start() {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  await connectDB(env.MONGO_URI);

  const app = createApp(env);

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error("Server failed to start:", err.message);
  process.exit(1);
});