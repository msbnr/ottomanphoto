import mongoose, { Schema } from 'mongoose';
import { IFranchiseApplication } from '../types';

const franchiseApplicationSchema = new Schema<IFranchiseApplication>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
    },
    concept: {
      type: String,
      required: [true, 'Concept selection is required'],
    },
    contact: {
      phone: {
        type: String,
        required: [true, 'Phone is required'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
      },
    },
    agreements: {
      terms: {
        type: Boolean,
        required: [true, 'Terms agreement is required'],
        validate: {
          validator: (v: boolean) => v === true,
          message: 'You must agree to the terms',
        },
      },
      privacy: {
        type: Boolean,
        required: [true, 'Privacy agreement is required'],
        validate: {
          validator: (v: boolean) => v === true,
          message: 'You must agree to the privacy policy',
        },
      },
      contract: {
        type: Boolean,
        required: [true, 'Contract agreement is required'],
        validate: {
          validator: (v: boolean) => v === true,
          message: 'You must agree to the contract',
        },
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
franchiseApplicationSchema.index({ status: 1 });
franchiseApplicationSchema.index({ createdAt: -1 });
franchiseApplicationSchema.index({ 'contact.email': 1 });

export default mongoose.model<IFranchiseApplication>('FranchiseApplication', franchiseApplicationSchema);
