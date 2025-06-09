import mongoose, { Schema, model, models } from 'mongoose';

export interface IReport {
  investor: mongoose.Types.ObjectId;
  analyst: mongoose.Types.ObjectId;
  stockSymbol: string;
  priceHistory: { date: Date; price: number }[];
  recommendation: string;
  portfolioPercent: number;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>({
  investor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  analyst: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stockSymbol: { type: String, required: true },
  priceHistory: [{ date: Date, price: Number }],
  recommendation: { type: String, required: true },
  portfolioPercent: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Report = models.Report || model<IReport>('Report', ReportSchema);