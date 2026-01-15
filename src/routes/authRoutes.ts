import express from 'express';
import { body } from 'express-validator';
import { login, validateToken, healthCheck } from '../controllers/authController';

const router = express.Router();

// Health Check
router.get('/health', healthCheck);

// Login
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  login
);

// Validate Token
router.post(
  '/validate',
  [
    body('token').trim().notEmpty().withMessage('Token is required'),
  ],
  validateToken
);

export default router;