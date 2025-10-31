import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Storage configuration
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local'; // 'local' or 'r2'

// R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // Optional: Custom domain for R2

// Initialize S3 client for R2
let s3Client: S3Client | null = null;

if (STORAGE_TYPE === 'r2' && R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  console.log('✅ R2 Storage initialized');
} else {
  console.log('ℹ️ Using local storage (uploads folder)');
}

interface UploadResult {
  success: boolean;
  url: string;
  key?: string;
  error?: string;
}

class StorageService {
  /**
   * Upload file to storage (R2 or local)
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    try {
      if (STORAGE_TYPE === 'r2' && s3Client && R2_BUCKET_NAME) {
        return await this.uploadToR2(file, folder);
      } else {
        return this.uploadToLocal(file, folder);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      return {
        success: false,
        url: '',
        error: error.message,
      };
    }
  }

  /**
   * Upload to Cloudflare R2
   */
  private async uploadToR2(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    try {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      const key = `${folder}/${filename}`;

      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client!.send(command);

      // Generate public URL
      const publicUrl = R2_PUBLIC_URL
        ? `${R2_PUBLIC_URL}/${key}`
        : `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

      return {
        success: true,
        url: publicUrl,
        key,
      };
    } catch (error: any) {
      console.error('R2 upload error:', error);
      return {
        success: false,
        url: '',
        error: error.message,
      };
    }
  }

  /**
   * Upload to local storage (fallback)
   */
  private uploadToLocal(file: Express.Multer.File, folder: string): UploadResult {
    // This is handled by multer middleware
    // Return the local path
    const localPath = `/uploads/${folder}/${file.filename}`;
    return {
      success: true,
      url: localPath,
    };
  }

  /**
   * Delete file from storage
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (STORAGE_TYPE === 'r2' && s3Client && R2_BUCKET_NAME) {
        return await this.deleteFromR2(fileUrl);
      } else {
        return this.deleteFromLocal(fileUrl);
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      return false;
    }
  }

  /**
   * Delete from Cloudflare R2
   */
  private async deleteFromR2(fileUrl: string): Promise<boolean> {
    try {
      // Extract key from URL
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) return false;

      const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME!,
        Key: key,
      });

      await s3Client!.send(command);
      return true;
    } catch (error: any) {
      console.error('R2 delete error:', error);
      return false;
    }
  }

  /**
   * Delete from local storage
   */
  private deleteFromLocal(fileUrl: string): boolean {
    try {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../', fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Local delete error:', error);
      return false;
    }
  }

  /**
   * Extract R2 key from URL
   */
  private extractKeyFromUrl(url: string): string | null {
    try {
      // Handle different URL formats
      if (R2_PUBLIC_URL && url.startsWith(R2_PUBLIC_URL)) {
        return url.replace(R2_PUBLIC_URL + '/', '');
      }

      // Extract from R2 URL
      const urlParts = url.split('/');
      const index = urlParts.findIndex((part) => part === 'uploads' || part === 'banners' || part === 'products');
      if (index !== -1) {
        return urlParts.slice(index).join('/');
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get storage type
   */
  getStorageType(): string {
    return STORAGE_TYPE;
  }

  /**
   * Check if R2 is configured
   */
  isR2Configured(): boolean {
    return !!(
      STORAGE_TYPE === 'r2' &&
      s3Client &&
      R2_ACCOUNT_ID &&
      R2_ACCESS_KEY_ID &&
      R2_SECRET_ACCESS_KEY &&
      R2_BUCKET_NAME
    );
  }
}

export default new StorageService();
