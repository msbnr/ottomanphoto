import { Router } from 'express';
import * as galleryController from '../controllers/galleryController';
import { adminAuth } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer for gallery image uploads
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/gallery';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const galleryUpload = multer({
  storage: galleryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Public routes
router.get('/', galleryController.getGalleryItems);
router.get('/:id', galleryController.getGalleryItemById);

// Admin routes
router.get('/admin/all', adminAuth, galleryController.getAllGalleryItems);
router.post('/', adminAuth, galleryController.createGalleryItem);
router.put('/:id', adminAuth, galleryController.updateGalleryItem);
router.delete('/:id', adminAuth, galleryController.deleteGalleryItem);

// Image upload endpoint
router.post(
  '/upload',
  adminAuth,
  galleryUpload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    res.status(200).json({
      success: true,
      data: { imageUrl },
    });
  }
);

export default router;
