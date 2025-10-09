import { IProduct, IUser, UserType, DealerTier } from '../types';

/**
 * Get the appropriate price for a product based on user type and dealer tier
 */
export const getProductPrice = (product: IProduct, user: IUser | null): number => {
  // If no user or customer, return retail price
  if (!user || user.userType === 'customer') {
    return product.pricing.retail;
  }

  // If user is a dealer, return price based on tier
  if (user.userType === 'dealer' && user.dealerTier) {
    switch (user.dealerTier) {
      case 'small':
        return product.pricing.dealer_small;
      case 'medium':
        return product.pricing.dealer_medium;
      case 'large':
        return product.pricing.dealer_large;
      case 'main_dealer':
        return product.pricing.dealer_main;
      default:
        return product.pricing.retail;
    }
  }

  // Default to retail
  return product.pricing.retail;
};

/**
 * Check if a product is visible to the current user
 */
export const isProductVisible = (product: IProduct, user: IUser | null): boolean => {
  // If no user or customer
  if (!user || user.userType === 'customer') {
    return product.visibility.customer;
  }

  // If dealer
  if (user.userType === 'dealer') {
    return product.visibility.dealer;
  }

  // If admin or supplier, show all products
  if (user.userType === 'admin' || user.userType === 'supplier') {
    return true;
  }

  return false;
};

/**
 * Filter products based on user visibility
 */
export const filterProductsByVisibility = (products: IProduct[], user: IUser | null): IProduct[] => {
  return products.filter((product) => isProductVisible(product, user));
};
