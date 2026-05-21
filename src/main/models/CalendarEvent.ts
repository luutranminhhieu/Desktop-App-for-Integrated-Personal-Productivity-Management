import mongoose, { Document, Schema } from 'mongoose';

export interface ICalendarEvent extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  color: string;
  userId: mongoose.Types.ObjectId;
  location?: string;
  notes?: string;
}

const CalendarEventSchema = new Schema<ICalendarEvent>(
  {
    title: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    color: { type: String, default: '#4F3CC9' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const CalendarEvent = mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
