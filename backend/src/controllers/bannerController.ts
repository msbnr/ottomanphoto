import { Request, Response } from 'express';
import Banner from '../models/Banner';
import fs from 'fs';
import path from 'path';

// Get all banners (public)
export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: { banners },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching banners',
      error,
    });
  }
};

// Get all banners for admin (including inactive)
export const getAdminBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find()
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: { banners },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching banners',
      error,
    });
  }
};

// Get single banner
export const getBannerById = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.json({
      success: true,
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching banner',
      error,
    });
  }
};

// Create banner
export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, description, link, order, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Banner image is required',
      });
    }

    const imageUrl = `/uploads/banners/${req.file.filename}`;

    const banner = await Banner.create({
      title,
      description,
      imageUrl,
      link,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      data: banner,
      message: 'Banner created successfully',
    });
  } catch (error) {
    // Delete uploaded file if banner creation fails
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/banners', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error creating banner',
      error,
    });
  }
};

// Update banner
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { title, description, link, order, isActive } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    // Update fields
    banner.title = title || banner.title;
    banner.description = description !== undefined ? description : banner.description;
    banner.link = link !== undefined ? link : banner.link;
    banner.order = order !== undefined ? order : banner.order;
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;

    // Update image if new file uploaded
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '../../', banner.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      banner.imageUrl = `/uploads/banners/${req.file.filename}`;
    }

    await banner.save();

    res.json({
      success: true,
      data: banner,
      message: 'Banner updated successfully',
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/banners', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error updating banner',
      error,
    });
  }
};

// Delete banner
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '../../', banner.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting banner',
      error,
    });
  }
};
