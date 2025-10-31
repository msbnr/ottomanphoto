import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { connectDatabase } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import { requestLogger, responseTime } from './middleware/requestLogger';
import { seedPages } from './utils/seedPages';
import { cleanupOldPages } from './utils/cleanupOldPages';

// Import routes
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import franchiseRoutes from './routes/franchiseRoutes';
import campaignRoutes from './routes/campaignRoutes';
import pageRoutes from './routes/pageRoutes';
import contactRoutes from './routes/contactRoutes';
import settingsRoutes from './routes/settingsRoutes';
import bannerRoutes from './routes/bannerRoutes';
import galleryRoutes from './routes/galleryRoutes';
import albumRoutes from './routes/albumRoutes';
import paymentRoutes from './routes/paymentRoutes';
import seedRoutes from './routes/seedRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Trust proxy - Required for Railway/Heroku/etc
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP for development
}));

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Request logging and response time
app.use(responseTime);
app.use(requestLogger);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ottoman Platform API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/seed', seedRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Cleanup old pages with outdated slugs
    await cleanupOldPages();

    // Seed default pages
    await seedPages();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
