import { Request, Response } from 'express';
import { Order, Product, User } from '../models';
import { getProductPrice } from '../utils/pricing';

/**
 * Create a new order
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { items, shippingAddress, notes } = req.body;

    // Get user
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Validate and calculate order
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
        return;
      }

      // Get correct price for user
      const price = getProductPrice(product, user);

      orderItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        price,
      });

      totalAmount += price * item.quantity;

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      userId: user._id,
      userType: user.userType,
      items: orderItems,
      totalAmount,
      shippingAddress,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get user's orders
 */
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { page = 1, limit = 10, status } = req.query;

    const query: any = { userId: req.user.userId };

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
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
 * Get single order by ID
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Check if user owns the order or is admin
    if (order.userId.toString() !== req.user.userId && req.user.userType !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all orders (Admin only)
 */
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status, userType } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (userType) {
      query.userType = userType;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
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
 * Update order status (Admin only)
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
