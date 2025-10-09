import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Customer registration
router.post(
  '/register/customer',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
  ]),
  authController.registerCustomer
);

// Dealer registration
router.post(
  '/register/dealer',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('taxNumber').notEmpty().withMessage('Tax number is required'),
    body('dealerTier').optional().isIn(['small', 'medium', 'large', 'main_dealer']),
  ]),
  authController.registerDealer
);

// Login
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  authController.login
);

// Get profile (protected)
router.get('/profile', authenticate, authController.getProfile);

// Update profile (protected)
router.put('/profile', authenticate, authController.updateProfile);

export default router;
