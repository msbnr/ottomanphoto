import { Router } from 'express';
import { body } from 'express-validator';
import * as orderController from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Create order (authenticated users)
router.post(
  '/',
  authenticate,
  validate([
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
    body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
    body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.country').notEmpty().withMessage('Country is required'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
  ]),
  orderController.createOrder
);

// Get my orders (authenticated users)
router.get('/my-orders', authenticate, orderController.getMyOrders);

// Get single order (authenticated users)
router.get('/:id', authenticate, orderController.getOrderById);

// Admin routes
router.get('/', authenticate, authorize('admin'), orderController.getAllOrders);

router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validate([body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])]),
  orderController.updateOrderStatus
);

export default router;
