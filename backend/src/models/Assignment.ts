import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  dueDate: Date;
  questionTypes: string[];
  numQuestions: number;
  marks: number;
  instructions: string;
  subject: string;
  className: string;
  fileUrl?: string;
  userId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const AssignmentSchema: Schema = new Schema({
  dueDate: { type: Date, required: true },
  questionTypes: { type: [String], required: true },
  numQuestions: { type: Number, required: true },
  marks: { type: Number, required: true },
  instructions: { type: String, required: true },
  subject: { type: String, required: true },
  className: { type: String, required: true },
  fileUrl: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
