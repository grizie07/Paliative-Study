const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

function createApp(env) {
  const app = express();

  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
  });

  app.use("/api/auth", loginLimiter);

  app.get("/health", (req, res) => {
    res.json({ ok: true, project: "RAD-PAL-QOL Study Backend" });
  });

  return app;
}

module.exports = { createApp };