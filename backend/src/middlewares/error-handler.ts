import { Request, Response, NextFunction } from "express";
import HttpError from "../errors/http-error";

export default function errorHandler(
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err.message || "Ошибка на сервере";

  res.status(status).json({ message });
}