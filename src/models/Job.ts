import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: Date;
  skills: string[];
  status: 'open' | 'closed' | 'completed';
  applicants: string[];
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    clientId: {
      type: String,
      required: [true, 'Client ID is required'],
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Design', 'Development', 'Photography', 'Tutoring', 'Writing', 'Beauty', 'Laundry', 'Video'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: 0,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    skills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'completed'],
      default: 'open',
    },
    applicants: [{
      type: String,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IJob>('Job', jobSchema);