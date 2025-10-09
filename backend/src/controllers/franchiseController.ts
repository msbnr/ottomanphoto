import { Request, Response } from 'express';
import { FranchiseApplication } from '../models';

/**
 * Submit franchise application
 */
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, location, concept, contact, agreements } = req.body;

    // Validate all agreements are accepted
    if (!agreements.terms || !agreements.privacy || !agreements.contract) {
      res.status(400).json({
        success: false,
        message: 'All agreements must be accepted',
      });
      return;
    }

    // Check if email already applied
    const existing = await FranchiseApplication.findOne({ 'contact.email': contact.email });

    if (existing) {
      res.status(400).json({
        success: false,
        message: 'An application with this email already exists',
      });
      return;
    }

    // Create application
    const application = await FranchiseApplication.create({
      fullName,
      location,
      concept,
      contact,
      agreements,
    });

    res.status(201).json({
      success: true,
      message: 'Franchise application submitted successfully',
      data: application,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all franchise applications (Admin only)
 */
export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const applications = await FranchiseApplication.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

    const total = await FranchiseApplication.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single application by ID (Admin only)
 */
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await FranchiseApplication.findById(id);

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update application status (Admin only)
 */
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await FranchiseApplication.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
