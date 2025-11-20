import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UnauthorizedError from "../errors/unauthorized-error";

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export default function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      return next(new UnauthorizedError("JWT секрет не найден"));
    }

    const payload = jwt.verify(token, secret);
    req.user = payload;

    return next();
  } catch {
    return next(new UnauthorizedError("Неверный или просроченный токен"));
  }
}