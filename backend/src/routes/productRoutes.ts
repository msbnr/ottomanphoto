import { Router } from 'express';
import { body } from 'express-validator';
import * as productController from '../controllers/productController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Public routes (with optional auth for pricing)
router.get('/', optionalAuth, productController.getProducts);
router.get('/:id', optionalAuth, productController.getProductById);

// Protected routes - Admin/Supplier only
router.post(
  '/',
  authenticate,
  authorize('admin', 'supplier'),
  validate([
    body('name').notEmpty().withMessage('Product name is required'),
    body('sku').notEmpty().withMessage('SKU is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('pricing.retail').isFloat({ min: 0 }).withMessage('Retail price must be a positive number'),
    body('pricing.dealer_small').isFloat({ min: 0 }).withMessage('Small dealer price must be a positive number'),
    body('pricing.dealer_medium').isFloat({ min: 0 }).withMessage('Medium dealer price must be a positive number'),
    body('pricing.dealer_large').isFloat({ min: 0 }).withMessage('Large dealer price must be a positive number'),
    body('pricing.dealer_main').isFloat({ min: 0 }).withMessage('Main dealer price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ]),
  productController.createProduct
);

router.put('/:id', authenticate, authorize('admin', 'supplier'), productController.updateProduct);

router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

// XML import
router.post('/import/xml', authenticate, authorize('admin', 'supplier'), productController.importProductsXML);

export default router;
