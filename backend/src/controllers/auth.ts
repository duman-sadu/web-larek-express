import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import BadRequestError from '../errors/bad-request-error';
import UnauthorizedError from '../errors/unauthorized-error';
import NotFoundError from '../errors/not-found-error';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config';
import { AuthRequest } from '../middlewares/auth';

interface TokenPayload {
  _id: string;
}

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return next(new BadRequestError('Необходимо указать email, пароль и имя'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new BadRequestError('Пользователь с таким Email уже существует'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });

    const accessToken = jwt.sign({ _id: user._id }, JWT_ACCESS_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: { email: user.email, name: user.name },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new BadRequestError('Необходимо указать email и пароль'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError('Неверный email или пароль'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new UnauthorizedError('Неверный email или пароль'));
    }

    const accessToken = jwt.sign({ _id: user._id }, JWT_ACCESS_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: { email: user.email, name: user.name },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // req.user уже проверен мидлварой auth
    if (!req.user || typeof req.user === 'string') {
      return next(new UnauthorizedError('Требуется авторизация'));
    }

    const payload = req.user as TokenPayload;

    const user = await User.findById(payload._id).select('-password');
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    res.status(200).json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new UnauthorizedError('Отсутствует refresh токен'));
    }

    let payload: TokenPayload;
    try {
      payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as TokenPayload;
    } catch {
      return next(new UnauthorizedError('Неверный или просроченный refresh токен'));
    }

    const newAccessToken = jwt.sign({ _id: payload._id }, JWT_ACCESS_SECRET, { expiresIn: '10m' });

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Вы вышли из системы' });
  } catch (error) {
    next(error);
  }
};

export default {
  register, login, getCurrentUser, refreshAccessToken, logout,
};