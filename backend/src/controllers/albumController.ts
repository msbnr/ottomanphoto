import { Request, Response } from 'express';
import Album from '../models/Album';

// Get all albums (public - only active)
export const getAlbums = async (req: Request, res: Response): Promise<void> => {
  try {
    const albums = await Album.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: { albums },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all albums (admin - including inactive)
export const getAllAlbumsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const albums = await Album.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: { albums },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single album
export const getAlbumById = async (req: Request, res: Response): Promise<void> => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      res.status(404).json({ success: false, message: 'Album bulunamadı' });
      return;
    }
    res.status(200).json({
      success: true,
      data: { album },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create album
export const createAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, coverImage, order, isActive } = req.body;

    const album = await Album.create({
      name,
      description,
      coverImage,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Albüm başarıyla oluşturuldu',
      data: { album },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update album
export const updateAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, coverImage, order, isActive } = req.body;

    const album = await Album.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        coverImage,
        order,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!album) {
      res.status(404).json({ success: false, message: 'Albüm bulunamadı' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Albüm başarıyla güncellendi',
      data: { album },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete album
export const deleteAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);

    if (!album) {
      res.status(404).json({ success: false, message: 'Albüm bulunamadı' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Albüm başarıyla silindi',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
