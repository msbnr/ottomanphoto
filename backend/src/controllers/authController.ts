import { Request, Response } from 'express';
import { User } from '../models';
import { generateToken } from '../utils/jwt';

/**
 * Register a new customer
 */
export const registerCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }

    // Create new customer
    const user = await User.create({
      email,
      password,
      userType: 'customer',
      profile: {
        firstName,
        lastName,
        phone,
      },
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          userType: user.userType,
          profile: user.profile,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Register a new dealer
 */
export const registerDealer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, companyName, taxNumber, dealerTier, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }

    // Create new dealer
    const user = await User.create({
      email,
      password,
      userType: 'dealer',
      dealerTier: dealerTier || 'small',
      profile: {
        companyName,
        taxNumber,
        phone,
        address,
      },
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Dealer registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          userType: user.userType,
          dealerTier: user.dealerTier,
          profile: user.profile,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          userType: user.userType,
          dealerTier: user.dealerTier,
          profile: user.profile,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        dealerTier: user.dealerTier,
        profile: user.profile,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const updates = req.body;

    // Don't allow updating sensitive fields
    delete updates.email;
    delete updates.password;
    delete updates.userType;
    delete updates.dealerTier;

    const user = await User.findByIdAndUpdate(req.user.userId, { $set: updates }, { new: true, runValidators: true });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        dealerTier: user.dealerTier,
        profile: user.profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
