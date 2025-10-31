/**
 * Get the full URL for an uploaded image
 * @param path - Relative path from backend (e.g., "/uploads/banners/image.jpg")
 * @returns Full URL to the image
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '/placeholder.jpg'; // Fallback image

  // If path is already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Get backend URL from environment
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Remove /api suffix to get base URL
  const BASE_URL = API_URL.replace('/api', '');

  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${BASE_URL}${cleanPath}`;
}

/**
 * Get WhatsApp URL from environment
 */
export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+905551234567';
}

/**
 * Format price with Turkish Lira
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price);
}
