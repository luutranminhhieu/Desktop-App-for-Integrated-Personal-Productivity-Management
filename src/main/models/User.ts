import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
