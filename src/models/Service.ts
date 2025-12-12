import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  freelancerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'FIXED' | 'NEGOTIABLE';
  skills: string[];
  portfolioImages: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    freelancerId: {
      type: String,
      required: [true, 'Freelancer ID is required'],
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Design', 'Development', 'Photography', 'Tutoring', 'Writing', 'Beauty', 'Laundry', 'Video'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    priceType: {
      type: String,
      enum: ['FIXED', 'NEGOTIABLE'],
      default: 'FIXED',
    },
    skills: {
      type: [String],
      default: [],
    },
    portfolioImages: {
      type: [String],
      default: [],
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

export default mongoose.model<IService>('Service', serviceSchema);