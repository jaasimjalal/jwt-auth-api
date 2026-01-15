import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import config from '../config';
import logger from '../utils/logger';
import { userStore } from '../utils/userStore';
import { AppError } from '../middleware/errorHandler';

interface LoginRequest {
  username: string;
  password: string;
}

interface ValidateRequest {
  token: string;
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400);
    }

    const { username, password } = req.body as LoginRequest;
    logger.info(`Login attempt for user: ${username}`);

    const userValidation = await userStore.validateUser(username, password);

    if (!userValidation.isValid) {
      logger.warn(`Invalid login attempt for user: ${username}`);
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { 
        sub: userValidation.userId,
        username 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    logger.info(`User ${username} logged in successfully`);

    res.status(200).json({
      success: true,
      data: {
        token,
        expiresIn: config.jwt.expiresIn,
        user: {
          id: userValidation.userId,
          username
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400);
    }

    const { token } = req.body as ValidateRequest;
    logger.info('Validating token');

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      logger.info('Token validation successful');

      res.status(200).json({
        success: true,
        data: {
          valid: true,
          decoded
        }
      });
    } catch (err) {
      logger.warn('Invalid token provided');
      throw new AppError('Invalid token', 401);
    }
  } catch (error) {
    next(error);
  }
};

export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};