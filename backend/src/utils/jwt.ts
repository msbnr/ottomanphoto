import jwt from 'jsonwebtoken';
import { IUser } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  userType: string;
  dealerTier?: string;
}

export const generateToken = (user: IUser): string => {
  const payload: JwtPayload = {
    userId: user._id ? user._id.toString() : '',
    email: user.email,
    userType: user.userType,
    dealerTier: user.dealerTier,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  } as any);
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};
