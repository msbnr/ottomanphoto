import { Request, Response } from 'express';
import Gallery from '../models/Gallery';

/**
 * Get all active gallery items (Public)
 * Query params: albumId - filter by album (or 'null' for uncategorized)
 */
export const getGalleryItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { albumId } = req.query;

    const filter: any = { isActive: true };

    // Filter by album if specified
    if (albumId) {
      if (albumId === 'null' || albumId === 'uncategorized') {
        filter.album = null;
      } else {
        filter.album = albumId;
      }
    }

    const items = await Gallery.find(filter)
      .populate('album')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        items,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all gallery items including inactive (Admin only)
 */
export const getAllGalleryItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Gallery.find()
      .populate('album')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        items,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single gallery item
 */
export const getGalleryItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Gallery item not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create gallery item (Admin only)
 */
export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, title, description, imageUrl, videoUrl, videoPlatform, thumbnail, album, order, isActive } = req.body;

    // Validation
    if (!type || !title) {
      res.status(400).json({ success: false, message: 'Type and title are required' });
      return;
    }

    if (type === 'image' && !imageUrl) {
      res.status(400).json({ success: false, message: 'Image URL is required for image type' });
      return;
    }

    if (type === 'video' && !videoUrl) {
      res.status(400).json({ success: false, message: 'Video URL is required for video type' });
      return;
    }

    const item = await Gallery.create({
      type,
      title,
      description,
      imageUrl,
      videoUrl,
      videoPlatform: videoPlatform || 'youtube', // Default to youtube if not provided
      thumbnail,
      album: album || null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update gallery item (Admin only)
 */
export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await Gallery.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404).json({ success: false, message: 'Gallery item not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete gallery item (Admin only)
 */
export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await Gallery.findByIdAndDelete(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Gallery item not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
