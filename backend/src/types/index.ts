import { Document } from 'mongoose';

// User Types
export type UserType = 'customer' | 'dealer' | 'admin' | 'franchise' | 'supplier';
export type DealerTier = 'small' | 'medium' | 'large' | 'main_dealer';

export interface IUser extends Document {
  email: string;
  password: string;
  userType: UserType;
  dealerTier?: DealerTier;
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    companyName?: string;
    taxNumber?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Product Types
export interface IPricing {
  retail: number;
  dealer_small: number;
  dealer_medium: number;
  dealer_large: number;
  dealer_main: number;
}

export interface IVisibility {
  customer: boolean;
  dealer: boolean;
  dealer_main: boolean;
  [key: string]: boolean;
}

export interface IMarketplace {
  active: boolean;
  productId?: string;
  lastSync?: Date;
}

export interface IProduct extends Document {
  name: string;
  sku: string;
  description: string;
  images: string[];
  category: string;
  pricing: IPricing;
  visibility: IVisibility;
  stock: number;
  boxQuantity: number;
  marketplaces: {
    trendyol: IMarketplace;
    hepsiburada: IMarketplace;
    n11: IMarketplace;
  };
  supplier?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrderItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: string;
  userType: UserType;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Franchise Application Types
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface IFranchiseApplication extends Document {
  fullName: string;
  location: {
    city: string;
    country: string;
  };
  concept: string;
  contact: {
    phone: string;
    email: string;
  };
  agreements: {
    terms: boolean;
    privacy: boolean;
    contract: boolean;
  };
  status: ApplicationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface ICategory extends Document {
  name: string;
  slug: string;
  parent?: string;
  visibility: string[];
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Supplier Types
export interface ISupplier extends Document {
  name: string;
  email: string;
  apiKey: string;
  apiEndpoint?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Dealer Form Field Types
export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number';

export interface IDealerFormField extends Document {
  fieldName: string;
  fieldType: FieldType;
  label: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
