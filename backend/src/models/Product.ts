import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    pricing: {
      retail: {
        type: Number,
        required: [true, 'Retail price is required'],
        min: 0,
      },
      dealer_small: {
        type: Number,
        required: [true, 'Small dealer price is required'],
        min: 0,
      },
      dealer_medium: {
        type: Number,
        required: [true, 'Medium dealer price is required'],
        min: 0,
      },
      dealer_large: {
        type: Number,
        required: [true, 'Large dealer price is required'],
        min: 0,
      },
      dealer_main: {
        type: Number,
        required: [true, 'Main dealer price is required'],
        min: 0,
      },
    },
    visibility: {
      customer: {
        type: Boolean,
        default: true,
      },
      dealer: {
        type: Boolean,
        default: true,
      },
      dealer_main: {
        type: Boolean,
        default: true,
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
      default: 0,
    },
    boxQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    marketplaces: {
      trendyol: {
        active: { type: Boolean, default: false },
        productId: String,
        lastSync: Date,
      },
      hepsiburada: {
        active: { type: Boolean, default: false },
        productId: String,
        lastSync: Date,
      },
      n11: {
        active: { type: Boolean, default: false },
        productId: String,
        lastSync: Date,
      },
    },
    supplier: {
      type: String,
      ref: 'Supplier',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
// Note: sku already has a unique index from the schema definition
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ 'visibility.customer': 1 });
productSchema.index({ 'visibility.dealer': 1 });
productSchema.index({ isActive: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
