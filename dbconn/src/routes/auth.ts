// routes/authRoutes.ts
import express, { Request, Response } from 'express';
import {
  login,
  logout,
  checkSession,
  google,
  register,
} from '../controllers/auth';

const router = express.Router();

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /auth/google
 * @desc Login with Google
 * @access Public
 */
router.post('/google', google);

/**
 * @route POST /auth/logout
 * @desc Logout a user
 * @access Private
 */
router.post('/logout', logout);

/**
 * @route GET /auth/session
 * @desc Check user session
 * @access Private
 */
router.get('/session', checkSession);

export default router;
