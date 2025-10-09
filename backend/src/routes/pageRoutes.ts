import { Router } from 'express';
import Page from '../models/Page';
import { auth, adminAuth } from '../middleware/auth';

const router = Router();

// Get all published pages (public)
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find({ isPublished: true })
      .select('-createdBy -updatedBy')
      .sort({ menuOrder: 1 });

    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get pages for menu (public)
router.get('/menu', async (req, res) => {
  try {
    const pages = await Page.find({ isPublished: true, showInMenu: true })
      .select('title slug menuOrder')
      .sort({ menuOrder: 1 });

    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get page by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isPublished: true })
      .select('-createdBy -updatedBy');

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin: Get all pages (including unpublished)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, isPublished } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

    const pages = await Page.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'email profile.firstName profile.lastName')
      .populate('updatedBy', 'email profile.firstName profile.lastName');

    const total = await Page.countDocuments(filter);

    res.json({
      pages,
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

// Admin: Get page by ID
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
      .populate('createdBy', 'email profile.firstName profile.lastName')
      .populate('updatedBy', 'email profile.firstName profile.lastName');

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin: Create page
router.post('/admin', adminAuth, async (req, res) => {
  try {
    const page = new Page({
      ...req.body,
      createdBy: req.user._id,
    });

    await page.save();
    res.status(201).json(page);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A page with this slug already exists' });
    }
    res.status(400).json({ message: 'Failed to create page', error: error.message });
  }
});

// Admin: Update page
router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A page with this slug already exists' });
    }
    res.status(400).json({ message: 'Failed to update page', error: error.message });
  }
});

// Admin: Delete page
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin: Toggle published status
router.patch('/admin/:id/toggle', adminAuth, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    page.isPublished = !page.isPublished;
    page.updatedBy = req.user._id;
    await page.save();

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
