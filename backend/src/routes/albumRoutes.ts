import express from 'express';
import {
  getAlbums,
  getAllAlbumsAdmin,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from '../controllers/albumController';
import { adminAuth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAlbums);
router.get('/:id', getAlbumById);

// Admin routes
router.get('/admin/all', adminAuth, getAllAlbumsAdmin);
router.post('/', adminAuth, createAlbum);
router.put('/:id', adminAuth, updateAlbum);
router.delete('/:id', adminAuth, deleteAlbum);

export default router;
