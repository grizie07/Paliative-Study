import express from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import User from "../models/User.js";
import { validate } from "../middleware/validate.js";
import { signAccessToken, signRefreshToken } from "../utils/tokens.js";

function authRoutes(env) {
  const router = express.Router();

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });

  router.post("/login", validate(loginSchema), async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        email: email.toLowerCase().trim()
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = signAccessToken(
        {
          userId: user._id.toString(),
          role: user.role,
          email: user.email
        },
        env
      );

      const refreshToken = signRefreshToken(
        {
          userId: user._id.toString()
        },
        env
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false
      });

      return res.json({
        accessToken,
        role: user.role,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      return res.status(500).json({
        message: "Login failed",
        error: error.message
      });
    }
  });

  return router;
}

export { authRoutes };