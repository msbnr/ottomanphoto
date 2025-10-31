import { Router } from 'express';
import { body } from 'express-validator';
import * as contactController from '../controllers/contactController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Public route - Submit contact message
router.post(
  '/',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ]),
  contactController.submitContact
);

// Admin routes
router.get('/', authenticate, authorize('admin'), contactController.getAllContacts);

router.get('/:id', authenticate, authorize('admin'), contactController.getContactById);

router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validate([body('status').isIn(['new', 'in_progress', 'resolved'])]),
  contactController.updateContactStatus
);

router.delete('/:id', authenticate, authorize('admin'), contactController.deleteContact);

export default router;
