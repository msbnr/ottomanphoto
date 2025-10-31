import Page from '../models/Page';

export const cleanupOldPages = async () => {
  try {
    // Delete pages with old slugs
    const oldSlugs = [
      'privacy-policy',
      'terms-of-service',
      'cookie-policy',
      'shipping-info',
      'return-policy'
    ];

    const result = await Page.deleteMany({ slug: { $in: oldSlugs } });

    if (result.deletedCount > 0) {
      console.log(`🗑️  ${result.deletedCount} old page(s) with outdated slugs deleted`);
    } else {
      console.log('✨ No old pages to clean up');
    }
  } catch (error) {
    console.error('❌ Error cleaning up old pages:', error);
  }
};
