import { Router, Request, Response } from 'express';
import { User, Product, Category } from '../models';
import bcrypt from 'bcryptjs';

const router = Router();

/**
 * @route   POST /api/seed/init
 * @desc    Initialize database with seed data (ONLY FOR FIRST TIME SETUP)
 * @access  Public (should be protected in production with a secret key)
 */
router.post('/init', async (req: Request, res: Response) => {
  try {
    const { secretKey } = req.body;

    // Simple protection - only allow if secret key matches
    if (secretKey !== process.env.SEED_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Invalid secret key',
      });
    }

    // Check if data already exists
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();

    if (userCount > 0 || categoryCount > 0 || productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Database already contains data. Use reset endpoint to clear first.',
        data: { userCount, categoryCount, productCount },
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@ottoman.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    // Create categories
    const categories = [
      {
        name: 'Elektronik',
        slug: 'elektronik',
        visibility: ['customer', 'dealer'],
        description: 'Bilgisayar, yazıcı ve elektronik cihazlar',
        isActive: true,
        order: 1,
      },
      {
        name: 'Ofis Malzemeleri',
        slug: 'ofis-malzemeleri',
        visibility: ['dealer'],
        description: 'Kağıt, ribbon, toner ve ofis sarf malzemeleri',
        isActive: true,
        order: 2,
      },
      {
        name: 'Mobilya',
        slug: 'mobilya',
        visibility: ['customer', 'dealer'],
        description: 'Ofis mobilyaları ve ekipmanları',
        isActive: true,
        order: 3,
      },
    ];

    const createdCategories = await Category.insertMany(categories);

    // Create sample products
    const elektroniCat = createdCategories.find(c => c.slug === 'elektronik');

    const products = [
      {
        name: 'Premium Lazer Yazıcı HP LaserJet Pro',
        sku: 'YAZICI-001',
        slug: 'premium-lazer-yazici-hp-laserjet-pro',
        description: 'Yüksek kaliteli ofis yazıcısı, A4 boyutunda baskı, 30 sayfa/dakika hız, WiFi bağlantı',
        category: elektroniCat?._id,
        images: ['https://via.placeholder.com/500x500?text=Printer'],
        pricing: {
          retail: 5000,
          dealer_main: 4500,
          dealer_small: 4300,
          dealer_medium: 4200,
          dealer_large: 4000,
        },
        stock: 50,
        isActive: true,
        isFeatured: true,
        visibility: ['customer', 'dealer'],
      },
    ];

    const createdProducts = await Product.insertMany(products);

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: 1,
        categories: createdCategories.length,
        products: createdProducts.length,
        adminCredentials: {
          email: 'admin@ottoman.com',
          password: 'admin123',
        },
      },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/seed/reset
 * @desc    Clear all data from database (DANGEROUS - USE WITH CAUTION)
 * @access  Protected
 */
router.post('/reset', async (req: Request, res: Response) => {
  try {
    const { secretKey, confirm } = req.body;

    if (secretKey !== process.env.SEED_SECRET_KEY || confirm !== 'DELETE_ALL_DATA') {
      return res.status(403).json({
        success: false,
        message: 'Invalid credentials or confirmation',
      });
    }

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'All data cleared successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear database',
      error: error.message,
    });
  }
});

export default router;
