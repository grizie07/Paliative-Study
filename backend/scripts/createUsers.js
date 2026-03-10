import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import readline from "readline";

import User from "../src/models/User.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected\n");

    const name = await ask("Enter name: ");
    const email = await ask("Enter email: ");
    const password = await ask("Enter password: ");
    const role = await ask("Enter role (admin/doctor): ");

    const existing = await User.findOne({ email });

    if (existing) {
      console.log("\nUser already exists with this email.");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      passwordHash,
      role,
      isActive: true
    });

    await user.save();

    console.log("\nUser created successfully:");
    console.log({
      name,
      email,
      role
    });

    rl.close();
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createUser();