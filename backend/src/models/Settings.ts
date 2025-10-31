import mongoose, { Schema } from 'mongoose';

export interface IFranchiseConcept {
  id: string;
  name: string;
  investment?: string; // Optional for backward compatibility
  isActive: boolean;
}

export interface IFranchiseFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface IFranchiseStat {
  id: string;
  label: string;
  value: string;
  icon: string;
  order: number;
}

export interface IPayTRSettings {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
  isActive: boolean;
}

export interface ISettings {
  franchiseConcepts: IFranchiseConcept[];
  franchiseFeatures: IFranchiseFeature[];
  franchiseStats: IFranchiseStat[];
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  whatsappNumber: string;
  paytr: IPayTRSettings;
  enableNotifications: boolean;
  enableRegistrations: boolean;
  maintenanceMode: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    franchiseConcepts: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        investment: { type: String, required: false }, // Optional
        isActive: { type: Boolean, default: true },
      },
    ],
    franchiseFeatures: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],
    franchiseStats: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        value: { type: String, required: true },
        icon: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
    ],
    siteName: {
      type: String,
      default: 'Ottoman Platform',
    },
    siteEmail: {
      type: String,
      default: 'info@ottoman.com',
    },
    sitePhone: {
      type: String,
      default: '+90 (212) 555 0000',
    },
    whatsappNumber: {
      type: String,
      default: '+905551234567',
    },
    paytr: {
      merchantId: {
        type: String,
        default: '',
      },
      merchantKey: {
        type: String,
        default: '',
      },
      merchantSalt: {
        type: String,
        default: '',
      },
      testMode: {
        type: Boolean,
        default: true,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    enableNotifications: {
      type: Boolean,
      default: true,
    },
    enableRegistrations: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISettings>('Settings', settingsSchema);
