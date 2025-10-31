import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  type: 'image' | 'video';
  title: string;
  description?: string;
  imageUrl?: string; // For images
  videoUrl?: string; // For YouTube/video URLs
  videoPlatform?: 'youtube' | 'youtube-shorts' | 'instagram'; // Video platform type
  thumbnail?: string; // Thumbnail for videos
  album?: mongoose.Types.ObjectId; // Reference to Album (null for uncategorized)
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGalleryItem>(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      required: function(this: IGalleryItem) {
        return this.type === 'image';
      },
    },
    videoUrl: {
      type: String,
      required: function(this: IGalleryItem) {
        return this.type === 'video';
      },
    },
    videoPlatform: {
      type: String,
      enum: ['youtube', 'youtube-shorts', 'instagram'],
      default: 'youtube', // Default to youtube for backwards compatibility
    },
    thumbnail: {
      type: String,
    },
    album: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering
gallerySchema.index({ order: 1, createdAt: -1 });

export default mongoose.model<IGalleryItem>('Gallery', gallerySchema);
