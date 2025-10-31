import { Router } from 'express';
import * as bannerController from '../controllers/bannerController';
import { adminAuth } from '../middleware/auth';
import { uploadBannerImage } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', bannerController.getAllBanners);

// Admin routes
router.get('/admin', adminAuth, bannerController.getAdminBanners);
router.get('/:id', adminAuth, bannerController.getBannerById);
router.post('/', adminAuth, uploadBannerImage.single('image'), bannerController.createBanner);
router.put('/:id', adminAuth, uploadBannerImage.single('image'), bannerController.updateBanner);
router.delete('/:id', adminAuth, bannerController.deleteBanner);

export default router;
