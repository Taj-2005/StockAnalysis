import mongoose, { Schema, model, models, Model, Document } from 'mongoose';

export interface IAnalysisRequest {
  analystId: mongoose.Types.ObjectId;
  investorId: mongoose.Types.ObjectId;
  stockSymbol: string;
  status: 'pending' | 'completed';
  result?: string;
  timestamp?: Date;
}

export interface IAnalysisRequestDocument extends IAnalysisRequest, Document {}

const AnalysisRequestSchema = new Schema<IAnalysisRequestDocument>({
  analystId: { type: Schema.Types.ObjectId, ref: 'StocksUser', required: true },
  investorId: { type: Schema.Types.ObjectId, ref: 'StocksUser', required: true }, // Make sure ref is 'StocksUser'
  stockSymbol: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], required: true },
  result: { type: String }, timestamp: { type : String, required:true }
});

export const AnalysisRequest: Model<IAnalysisRequestDocument> =
  models.AnalysisRequest || model<IAnalysisRequestDocument>('AnalysisRequest', AnalysisRequestSchema);
