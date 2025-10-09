import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  title: string;
  slug: string; // URL-friendly version of title
  content: string; // HTML content
  metaDescription?: string;
  isPublished: boolean;
  showInMenu: boolean;
  menuOrder: number;
  createdBy: string; // User ID of admin who created it
  updatedBy?: string; // User ID of admin who last updated it
  createdAt: Date;
  updatedAt: Date;
}

const pageSchema = new Schema<IPage>(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Page slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      // URL-friendly format: only lowercase letters, numbers, and hyphens
      match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'],
    },
    content: {
      type: String,
      required: [true, 'Page content is required'],
    },
    metaDescription: {
      type: String,
      maxlength: 160,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    showInMenu: {
      type: Boolean,
      default: false,
    },
    menuOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
      ref: 'User',
    },
    updatedBy: {
      type: String,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
pageSchema.index({ slug: 1 });
pageSchema.index({ isPublished: 1 });
pageSchema.index({ showInMenu: 1, menuOrder: 1 });

// Pre-save hook to generate slug from title if not provided
pageSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    // Generate slug from title
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }
  next();
});

export default mongoose.model<IPage>('Page', pageSchema);
