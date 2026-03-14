import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/User.js";

dotenv.config();

async function prompt(question) {
  process.stdout.write(question);
  return new Promise((resolve) => {
    process.stdin.once("data", (data) => resolve(String(data).trim()));
  });
}

async function main() {
  const roleArg = (process.argv[2] || "admin").toLowerCase();
  const role = roleArg === "doctor" ? "doctor" : "admin";

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI missing in .env");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");

  const name = await prompt("Name: ");
  const email = (await prompt("Email: ")).toLowerCase().trim();
  const password = await prompt("Password (min 8 chars): ");

  if (!name || !email || password.length < 8) {
    console.error("Invalid input. Ensure name/email are provided and password is at least 8 characters.");
    await mongoose.disconnect();
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.error("User already exists with this email.");
    await mongoose.disconnect();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email,
    passwordHash,
    role,
    isActive: true
  });

  console.log(`${role.toUpperCase()} user created successfully`);
  console.log({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  });

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (error) => {
  console.error("Error:", error.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});