import { Router } from 'express';
import { body } from 'express-validator';
import * as franchiseController from '../controllers/franchiseController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Public route - Submit franchise application
router.post(
  '/apply',
  validate([
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('location.city').notEmpty().withMessage('City is required'),
    body('location.country').notEmpty().withMessage('Country is required'),
    body('concept').notEmpty().withMessage('Concept selection is required'),
    body('contact.phone').notEmpty().withMessage('Phone is required'),
    body('contact.email').isEmail().withMessage('Valid email is required'),
    body('agreements.terms').equals('true').withMessage('You must agree to terms'),
    body('agreements.privacy').equals('true').withMessage('You must agree to privacy policy'),
    body('agreements.contract').equals('true').withMessage('You must agree to contract'),
  ]),
  franchiseController.submitApplication
);

// Admin routes
router.get('/', authenticate, authorize('admin'), franchiseController.getAllApplications);

router.get('/:id', authenticate, authorize('admin'), franchiseController.getApplicationById);

router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validate([body('status').isIn(['pending', 'approved', 'rejected'])]),
  franchiseController.updateApplicationStatus
);

export default router;
