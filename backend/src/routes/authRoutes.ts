import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authenticate, adminAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import User from '../models/User';

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

// Address management (protected)
router.get('/addresses', authenticate, authController.getAddresses);
router.post(
  '/addresses',
  authenticate,
  validate([
    body('title').notEmpty().withMessage('Address title is required'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('street').notEmpty().withMessage('Street is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State/District is required'),
    body('postalCode').notEmpty().withMessage('Postal code is required'),
  ]),
  authController.addAddress
);
router.put('/addresses/:addressId', authenticate, authController.updateAddress);
router.delete('/addresses/:addressId', authenticate, authController.deleteAddress);

// Change password (protected)
router.put(
  '/change-password',
  authenticate,
  validate([
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ]),
  authController.changePassword
);

// Admin: Get all users
router.get('/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
