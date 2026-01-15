import express from 'express';
import cors from 'cors';
import config from './config';
import logger from './utils/logger';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Global Middleware
app.use(express.json());
app.use(
  cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
  })
);

// Logging incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} from ${req.ip}`);
  next();
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/health', authRoutes); // Alias for convenience

// 404 Handler
app.use('*', (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 404
    }
  });
});

// Error Handler
app.use(errorHandler);

export default app;