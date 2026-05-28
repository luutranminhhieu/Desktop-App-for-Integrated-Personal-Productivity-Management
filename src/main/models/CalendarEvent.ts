import mongoose, { Document, Schema } from 'mongoose';

export type CalendarEventStatus = 'pending' | 'confirmed' | 'tentative' | 'canceled' | 'completed';

export interface ICalendarEvent extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  color: string;
  status: CalendarEventStatus;
  userId: mongoose.Types.ObjectId;
  location?: string;
  notes?: string;
}

const CalendarEventSchema = new Schema<ICalendarEvent>(
  {
    title: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    color: { type: String, default: '#3B82F6' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'tentative', 'canceled', 'completed'],
      default: 'confirmed'
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const CalendarEvent = mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
