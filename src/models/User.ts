import mongoose, { Schema, model, models, Model, Document } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  role: 'investor' | 'analyst';
  assignedInvestors?: mongoose.Types.ObjectId[];
  assignedAnalyst?: mongoose.Types.ObjectId;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['investor', 'analyst'], required: true },
  assignedInvestors: [{ type: Schema.Types.ObjectId, ref: 'StocksUser' }],
  assignedAnalyst: { type: Schema.Types.ObjectId, ref: 'StocksUser' },
});

export const User: Model<IUserDocument> = models.StocksUser || model<IUserDocument>('StocksUser', UserSchema);
