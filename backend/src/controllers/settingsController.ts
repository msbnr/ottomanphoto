import { Request, Response } from 'express';
import Settings from '../models/Settings';

/**
 * Get settings (Public - for franchise concepts)
 */
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await Settings.create({
        franchiseConcepts: [
          { id: 'concept1', name: 'Mini Market (50-100 m²)', investment: '₺150,000 - ₺250,000', isActive: true },
          { id: 'concept2', name: 'Standart Mağaza (100-200 m²)', investment: '₺250,000 - ₺400,000', isActive: true },
          { id: 'concept3', name: 'Büyük Mağaza (200+ m²)', investment: '₺400,000+', isActive: true },
        ],
        franchiseFeatures: [
          { id: 'feature1', title: 'Yerleşik Marka Gücü', description: 'Tanınmış bir marka ile işe başlayın', icon: 'Award', isActive: true, order: 1 },
          { id: 'feature2', title: 'Profesyonel Eğitim', description: 'Fotoğrafçılık ve satış eğitimleri', icon: 'GraduationCap', isActive: true, order: 2 },
          { id: 'feature3', title: 'Gelişmiş Yazılım', description: 'İş takibi ve yönetim sistemi', icon: 'Computer', isActive: true, order: 3 },
          { id: 'feature4', title: 'Yüksek Kar Marjı', description: 'Rekabetçi fiyatlandırma avantajı', icon: 'TrendingUp', isActive: true, order: 4 },
        ],
        franchiseStats: [
          { id: 'stat1', label: 'Aktif Bayi', value: '50+', icon: 'Building', order: 1 },
          { id: 'stat2', label: 'Bayi Memnuniyeti', value: '%95', icon: 'ThumbsUp', order: 2 },
          { id: 'stat3', label: 'Ortalama Geri Dönüş', value: '3 Ay', icon: 'TrendingUp', order: 3 },
          { id: 'stat4', label: 'Teknik Destek', value: '24/7', icon: 'Headphones', order: 4 },
        ],
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update settings (Admin only)
 */
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = req.body;

    // Use findOneAndUpdate to avoid version conflicts
    let settings = await Settings.findOneAndUpdate(
      {},
      { $set: updates },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get active franchise concepts (Public)
 */
export const getFranchiseConcepts = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        franchiseConcepts: [
          { id: 'concept1', name: 'Mini Market (50-100 m²)', investment: '₺150,000 - ₺250,000', isActive: true },
          { id: 'concept2', name: 'Standart Mağaza (100-200 m²)', investment: '₺250,000 - ₺400,000', isActive: true },
          { id: 'concept3', name: 'Büyük Mağaza (200+ m²)', investment: '₺400,000+', isActive: true },
        ],
        franchiseFeatures: [
          { id: 'feature1', title: 'Yerleşik Marka Gücü', description: 'Tanınmış bir marka ile işe başlayın', icon: 'Award', isActive: true, order: 1 },
          { id: 'feature2', title: 'Profesyonel Eğitim', description: 'Fotoğrafçılık ve satış eğitimleri', icon: 'GraduationCap', isActive: true, order: 2 },
          { id: 'feature3', title: 'Gelişmiş Yazılım', description: 'İş takibi ve yönetim sistemi', icon: 'Computer', isActive: true, order: 3 },
          { id: 'feature4', title: 'Yüksek Kar Marjı', description: 'Rekabetçi fiyatlandırma avantajı', icon: 'TrendingUp', isActive: true, order: 4 },
        ],
        franchiseStats: [
          { id: 'stat1', label: 'Aktif Bayi', value: '50+', icon: 'Building', order: 1 },
          { id: 'stat2', label: 'Bayi Memnuniyeti', value: '%95', icon: 'ThumbsUp', order: 2 },
          { id: 'stat3', label: 'Ortalama Geri Dönüş', value: '3 Ay', icon: 'TrendingUp', order: 3 },
          { id: 'stat4', label: 'Teknik Destek', value: '24/7', icon: 'Headphones', order: 4 },
        ],
      });
    }

    const activeConcepts = settings.franchiseConcepts.filter(c => c.isActive);

    res.status(200).json({
      success: true,
      data: {
        concepts: activeConcepts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get active franchise features (Public)
 */
export const getFranchiseFeatures = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        franchiseConcepts: [
          { id: 'concept1', name: 'Mini Market (50-100 m²)', investment: '₺150,000 - ₺250,000', isActive: true },
          { id: 'concept2', name: 'Standart Mağaza (100-200 m²)', investment: '₺250,000 - ₺400,000', isActive: true },
          { id: 'concept3', name: 'Büyük Mağaza (200+ m²)', investment: '₺400,000+', isActive: true },
        ],
        franchiseFeatures: [
          { id: 'feature1', title: 'Yerleşik Marka Gücü', description: 'Tanınmış bir marka ile işe başlayın', icon: 'Award', isActive: true, order: 1 },
          { id: 'feature2', title: 'Profesyonel Eğitim', description: 'Fotoğrafçılık ve satış eğitimleri', icon: 'GraduationCap', isActive: true, order: 2 },
          { id: 'feature3', title: 'Gelişmiş Yazılım', description: 'İş takibi ve yönetim sistemi', icon: 'Computer', isActive: true, order: 3 },
          { id: 'feature4', title: 'Yüksek Kar Marjı', description: 'Rekabetçi fiyatlandırma avantajı', icon: 'TrendingUp', isActive: true, order: 4 },
        ],
        franchiseStats: [
          { id: 'stat1', label: 'Aktif Bayi', value: '50+', icon: 'Building', order: 1 },
          { id: 'stat2', label: 'Bayi Memnuniyeti', value: '%95', icon: 'ThumbsUp', order: 2 },
          { id: 'stat3', label: 'Ortalama Geri Dönüş', value: '3 Ay', icon: 'TrendingUp', order: 3 },
          { id: 'stat4', label: 'Teknik Destek', value: '24/7', icon: 'Headphones', order: 4 },
        ],
      });
    }

    const activeFeatures = settings.franchiseFeatures
      ? settings.franchiseFeatures.filter(f => f.isActive).sort((a, b) => a.order - b.order)
      : [];

    res.status(200).json({
      success: true,
      data: {
        features: activeFeatures,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
