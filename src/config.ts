import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/trim",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  publicBaseUrl: (process.env.PUBLIC_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "")
};
