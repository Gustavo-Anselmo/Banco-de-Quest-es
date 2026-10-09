import express from "express";
import cors from "cors";
import { router } from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
  app.use(express.json());

  app.use("/api", router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
