import mongoose from "mongoose";

async function connectDB(uri) {
  if (!uri) {
    throw new Error("MongoDB connection URI is missing");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);

  console.log("MongoDB connected");
}

export { connectDB };