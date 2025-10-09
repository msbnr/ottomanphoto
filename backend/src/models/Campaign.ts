import mongoose, { Schema, Document } from 'mongoose';

export type CampaignType = 'buy_one_get_one' | 'cart_discount' | 'free_shipping' | 'category_discount';

export interface ICampaign extends Document {
  name: string;
  type: CampaignType;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;

  // Buy One Get One (1+1)
  buyOneGetOne?: {
    productIds: string[];
    freeQuantity: number; // e.g., 1 for "buy 1 get 1 free"
  };

  // Cart-based discount
  cartDiscount?: {
    minCartAmount: number;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxDiscount?: number; // max discount amount for percentage type
  };

  // Free shipping
  freeShipping?: {
    minCartAmount: number;
  };

  // Category-based discount
  categoryDiscount?: {
    categoryIds: string[];
    discountType: 'percentage' | 'fixed';
    discountValue: number;
  };

  // Target audience
  targetAudience: {
    userTypes: ('customer' | 'dealer' | 'all')[];
    dealerTiers?: ('small' | 'medium' | 'large' | 'main_dealer')[];
  };

  usageLimit?: {
    totalUsage?: number;
    perUser?: number;
    currentUsage: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['buy_one_get_one', 'cart_discount', 'free_shipping', 'category_discount'],
      required: [true, 'Campaign type is required'],
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Buy One Get One
    buyOneGetOne: {
      productIds: [String],
      freeQuantity: Number,
    },

    // Cart Discount
    cartDiscount: {
      minCartAmount: Number,
      discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
      },
      discountValue: Number,
      maxDiscount: Number,
    },

    // Free Shipping
    freeShipping: {
      minCartAmount: Number,
    },

    // Category Discount
    categoryDiscount: {
      categoryIds: [String],
      discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
      },
      discountValue: Number,
    },

    // Target Audience
    targetAudience: {
      userTypes: {
        type: [String],
        enum: ['customer', 'dealer', 'all'],
        default: ['all'],
      },
      dealerTiers: {
        type: [String],
        enum: ['small', 'medium', 'large', 'main_dealer'],
      },
    },

    // Usage Limit
    usageLimit: {
      totalUsage: Number,
      perUser: Number,
      currentUsage: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
campaignSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
campaignSchema.index({ type: 1 });

// Method to check if campaign is currently valid
campaignSchema.methods.isValidCampaign = function(): boolean {
  const now = new Date();
  return (
    this.isActive &&
    this.startDate <= now &&
    this.endDate >= now &&
    (!this.usageLimit?.totalUsage || this.usageLimit.currentUsage < this.usageLimit.totalUsage)
  );
};

export default mongoose.model<ICampaign>('Campaign', campaignSchema);
