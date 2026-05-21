import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  avatarUrl?: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  avatarUrl: { type: String },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
