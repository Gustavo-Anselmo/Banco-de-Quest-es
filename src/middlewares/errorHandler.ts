import { NextFunction, Request, Response } from "express";
import { HttpError } from "../types";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ message: "Erro interno no servidor." });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: "Rota não encontrada." });
}
