import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  role: 'investor' | 'analyst';
  assignedInvestors?: mongoose.Types.ObjectId[]; // For analysts
}

const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['investor', 'analyst'], required: true },
  assignedInvestors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export const User = models.StocksUser || model<IUser>('StocksUser', UserSchema);