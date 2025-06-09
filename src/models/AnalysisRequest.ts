import mongoose, { Schema, model, models } from 'mongoose';

interface IAnalysisRequest {
  analystId: mongoose.Types.ObjectId;
  investorId: mongoose.Types.ObjectId;
  stockSymbol: string;
  status: 'pending' | 'completed';
  result?: string;
  createdAt: Date;
}

const AnalysisRequestSchema = new Schema<IAnalysisRequest>({
  analystId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  investorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stockSymbol: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  result: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const AnalysisRequest = models.AnalysisRequest || model('AnalysisRequest', AnalysisRequestSchema);
