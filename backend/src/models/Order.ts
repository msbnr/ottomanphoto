import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../types';

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    userType: {
      type: String,
      enum: ['customer', 'dealer', 'admin', 'franchise', 'supplier'],
      required: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
          ref: 'Product',
        },
        name: {
          type: String,
          required: true,
        },
        sku: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>('Order', orderSchema);
