import { Router } from 'express';
import Campaign from '../models/Campaign';
import { auth, adminAuth } from '../middleware/auth';

const router = Router();

// Get all campaigns (public - active only)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const campaigns = await Campaign.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).select('-usageLimit');

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Apply campaign to cart (calculate discount)
router.post('/apply', auth, async (req, res) => {
  try {
    const { campaignId, cart } = req.body;
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if campaign is valid
    const now = new Date();
    const isValid = campaign.isActive &&
      campaign.startDate <= now &&
      campaign.endDate >= now &&
      (!campaign.usageLimit?.totalUsage || campaign.usageLimit.currentUsage < campaign.usageLimit.totalUsage);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired campaign' });
    }

    // Check target audience
    const user = req.user;
    const targetAudience = campaign.targetAudience;

    if (!targetAudience.userTypes.includes('all')) {
      if (user.userType === 'dealer' && !targetAudience.userTypes.includes('dealer')) {
        return res.status(403).json({ message: 'Campaign not available for dealers' });
      }
      if (user.userType === 'customer' && !targetAudience.userTypes.includes('customer')) {
        return res.status(403).json({ message: 'Campaign not available for customers' });
      }
    }

    let discount = 0;
    let freeShipping = false;

    // Calculate discount based on campaign type
    switch (campaign.type) {
      case 'cart_discount':
        if (campaign.cartDiscount && cart.total >= campaign.cartDiscount.minCartAmount) {
          if (campaign.cartDiscount.discountType === 'percentage') {
            discount = (cart.total * campaign.cartDiscount.discountValue) / 100;
            if (campaign.cartDiscount.maxDiscount && discount > campaign.cartDiscount.maxDiscount) {
              discount = campaign.cartDiscount.maxDiscount;
            }
          } else {
            discount = campaign.cartDiscount.discountValue;
          }
        }
        break;

      case 'free_shipping':
        if (campaign.freeShipping && cart.total >= campaign.freeShipping.minCartAmount) {
          freeShipping = true;
        }
        break;

      case 'category_discount':
        if (campaign.categoryDiscount) {
          // Calculate discount for items in specified categories
          const categoryItems = cart.items.filter((item: any) =>
            campaign.categoryDiscount!.categoryIds.includes(item.categoryId)
          );
          const categoryTotal = categoryItems.reduce((sum: number, item: any) => sum + item.subtotal, 0);

          if (campaign.categoryDiscount.discountType === 'percentage') {
            discount = (categoryTotal * campaign.categoryDiscount.discountValue) / 100;
          } else {
            discount = campaign.categoryDiscount.discountValue;
          }
        }
        break;

      case 'buy_one_get_one':
        // This should be handled at item level, return product IDs eligible for free items
        return res.json({
          campaign,
          buyOneGetOneProducts: campaign.buyOneGetOne?.productIds || [],
          freeQuantity: campaign.buyOneGetOne?.freeQuantity || 0,
        });
    }

    res.json({
      campaign,
      discount,
      freeShipping,
      newTotal: Math.max(0, cart.total - discount),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin: Get all campaigns (including inactive)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, isActive } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Campaign.countDocuments(filter);

    res.json({
      campaigns,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin: Create campaign
router.post('/admin', adminAuth, async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create campaign', error });
  }
});

// Admin: Update campaign
router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update campaign', error });
  }
});

// Admin: Delete campaign
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin: Toggle campaign active status
router.patch('/admin/:id/toggle', adminAuth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.isActive = !campaign.isActive;
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
