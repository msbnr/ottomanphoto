import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Check storage type from environment
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';

// Ensure upload directories exist (for local storage)
if (STORAGE_TYPE === 'local') {
  const uploadDirs = [
    path.join(__dirname, '../../uploads'),
    path.join(__dirname, '../../uploads/banners'),
    path.join(__dirname, '../../uploads/products'),
    path.join(__dirname, '../../uploads/gallery'),
    path.join(__dirname, '../../uploads/albums'),
    path.join(__dirname, '../../uploads/pages'),
  ];

  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Storage configuration
// Use memoryStorage for R2, diskStorage for local
const getStorage = (folder: string) => {
  if (STORAGE_TYPE === 'r2') {
    // For R2, use memory storage (file will be in buffer)
    return multer.memoryStorage();
  } else {
    // For local, use disk storage
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `../../uploads/${folder}`));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${folder}-${uniqueSuffix}${ext}`);
      },
    });
  }
};

// File filter for images
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG and WEBP images are allowed'));
  }
};

// Upload middlewares
export const uploadBannerImage = multer({
  storage: getStorage('banners'),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadProductImage = multer({
  storage: getStorage('products'),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadGalleryImage = multer({
  storage: getStorage('gallery'),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadAlbumImage = multer({
  storage: getStorage('albums'),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadPageImage = multer({
  storage: getStorage('pages'),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
