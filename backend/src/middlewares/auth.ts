import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import { JWT_ACCESS_SECRET } from '../config';

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export default function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = payload;
    return next();
  } catch {
    return next(new UnauthorizedError('Неверный или просроченный токен'));
  }
}