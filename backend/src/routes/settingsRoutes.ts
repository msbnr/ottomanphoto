import { Router } from 'express';
import * as settingsController from '../controllers/settingsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', settingsController.getSettings);
router.get('/franchise-concepts', settingsController.getFranchiseConcepts);
router.get('/franchise-features', settingsController.getFranchiseFeatures);

// Admin routes
router.put('/', authenticate, authorize('admin'), settingsController.updateSettings);

export default router;
