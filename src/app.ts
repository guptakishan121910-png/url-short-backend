import cors from "cors";
import express from "express";

import { config } from "./config.js";
import { errorHandler, notFound } from "./errors.js";
import { linksRouter } from "./routes/links.js";
import { redirectRouter } from "./routes/redirect.js";

const allowedOrigins = new Set([
  config.clientOrigin,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://prismatic-licorice-8e239c.netlify.app"
]);

export function createApp() {
  const app = express();

  app.set("trust proxy", true);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }

        try {
          const parsed = new URL(origin);
          const isLocalVite =
            /^517\d$/.test(parsed.port) &&
            (parsed.hostname === "localhost" ||
              parsed.hostname === "127.0.0.1" ||
              parsed.hostname.startsWith("192.168.") ||
              parsed.hostname.startsWith("172."));
          const isNetlifyApp = parsed.protocol === "https:" && parsed.hostname.endsWith(".netlify.app");

          callback(null, allowedOrigins.has(origin) || isLocalVite || isNetlifyApp);
        } catch {
          callback(null, false);
        }
      }
    })
  );
  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({ ok: true });
  });

  app.use("/api/links", linksRouter);
  app.use(redirectRouter);

  app.use((_request, _response, next) => {
    next(notFound());
  });

  app.use(errorHandler);

  return app;
}
