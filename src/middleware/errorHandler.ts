import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(err instanceof AppError)) {
    error = new AppError('Internal Server Error', 500);
    logger.error(err.stack);
  } else {
    logger.error(`${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  res.status((error as AppError).statusCode).json({
    success: false,
    error: {
      message: error.message,
      code: (error as AppError).statusCode
    }
  });
};