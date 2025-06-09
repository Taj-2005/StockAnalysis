import mongoose, { Schema, model, models, Model, Document } from 'mongoose';

import { Types } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  role: 'investor' | 'analyst';
  assignedInvestors?: Types.ObjectId[];
  assignedAnalyst?: Types.ObjectId | IUserDocument | null;
}

export interface IUserDocument extends IUser, mongoose.Document {}


const UserSchema = new Schema<IUserDocument>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['investor', 'analyst'], required: true },
  assignedInvestors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  assignedAnalyst: { type: Schema.Types.ObjectId, ref: 'User' },
});

export const User: Model<IUserDocument> =
  models.StocksUser || model<IUserDocument>('StocksUser', UserSchema);