import mongoose, { Schema } from 'mongoose';
import { IDealerFormField } from '../types';

const dealerFormFieldSchema = new Schema<IDealerFormField>(
  {
    fieldName: {
      type: String,
      required: [true, 'Field name is required'],
      unique: true,
      trim: true,
    },
    fieldType: {
      type: String,
      enum: ['text', 'email', 'tel', 'textarea', 'select', 'checkbox', 'radio', 'number'],
      required: [true, 'Field type is required'],
    },
    label: {
      type: String,
      required: [true, 'Label is required'],
    },
    placeholder: String,
    options: [String],
    required: {
      type: Boolean,
      default: false,
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

// Indexes
dealerFormFieldSchema.index({ order: 1 });
dealerFormFieldSchema.index({ isActive: 1 });

export default mongoose.model<IDealerFormField>('DealerFormField', dealerFormFieldSchema);
