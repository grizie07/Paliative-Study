import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { authRoutes } from "./routes/auth.routes.js";
import { patientRoutes } from "./routes/patients.routes.js";
import assessmentRoutes from "./routes/assessments.routes.js";
import { conferenceRoutes } from "./routes/conference.routes.js";
import { exportRoutes } from "./routes/export.routes.js";
import { auth } from "./middleware/auth.js";

function createApp(env) {
  const app = express();

  const allowedOrigins = [
    "http://localhost:5173",
    "https://paliative-study.vercel.app/"
  ];

  if (env.CORS_ORIGIN) {
    allowedOrigins.push(env.CORS_ORIGIN);
  }

  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      },
      credentials: true
    })
  );

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false
  });

  app.get("/", (req, res) => {
    res.send("RAD-PAL-QOL backend is running");
  });

  app.get("/health", (req, res) => {
    res.json({
      ok: true,
      project: "RAD-PAL-QOL Study Backend"
    });
  });

  app.use("/api/auth", loginLimiter, authRoutes(env));
  app.use("/api/patients", auth(env), patientRoutes());
  app.use("/api/assessments", auth(env), assessmentRoutes);
  app.use("/api/conference-records", auth(env), conferenceRoutes());
  app.use("/api/export", auth(env), exportRoutes(env));

  app.use((err, req, res, next) => {
    if (err.message?.startsWith("Not allowed by CORS")) {
      return res.status(403).json({ message: err.message });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  });

  return app;
}

export { createApp };