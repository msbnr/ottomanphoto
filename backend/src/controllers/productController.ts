import { Request, Response } from 'express';
import { Product, User } from '../models';
import { getProductPrice, isProductVisible } from '../utils/pricing';

/**
 * Get all products (with visibility and pricing based on user)
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const query: any = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Text search
    if (search) {
      query.$text = { $search: search as string };
    }

    // Get user for visibility and pricing
    let user = null;
    if (req.user) {
      user = await User.findById(req.user.userId);
    }

    // Build visibility query
    if (!user || user.userType === 'customer') {
      query['visibility.customer'] = true;
    } else if (user.userType === 'dealer') {
      query['visibility.dealer'] = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    // Add appropriate price to each product
    const productsWithPrice = products.map((product) => {
      const productObj = product.toObject();
      return {
        ...productObj,
        price: getProductPrice(product, user),
        // Remove pricing object for non-admin users
        pricing: user && (user.userType === 'admin' || user.userType === 'supplier') ? productObj.pricing : undefined,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        products: productsWithPrice,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single product by ID
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Get user for visibility check
    let user = null;
    if (req.user) {
      user = await User.findById(req.user.userId);
    }

    // Check visibility
    if (!isProductVisible(product, user)) {
      res.status(403).json({ success: false, message: 'Product not accessible' });
      return;
    }

    const productObj = product.toObject();

    res.status(200).json({
      success: true,
      data: {
        ...productObj,
        price: getProductPrice(product, user),
        pricing: user && (user.userType === 'admin' || user.userType === 'supplier') ? productObj.pricing : undefined,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create new product (Admin/Supplier only)
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update product (Admin/Supplier only)
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete product (Admin only)
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Bulk import products from XML (Admin/Supplier only)
 */
export const importProductsXML = async (req: Request, res: Response): Promise<void> => {
  try {
    // This will be implemented with xml2js parser
    // For now, returning placeholder
    res.status(501).json({
      success: false,
      message: 'XML import feature coming soon',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
