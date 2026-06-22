import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { app } from 'electron';
import { join, dirname } from 'path';

// Load env variables from executable directory in production, or cwd in development
let envPath: string;
try {
  envPath = app.isPackaged
    ? join(dirname(app.getPath('exe')), '.env')
    : join(process.cwd(), '.env');
} catch {
  envPath = join(process.cwd(), '.env');
}

dotenv.config({ path: envPath });

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB. Attempting to reconnect...');
    });

    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
    process.exit(1);
  }
};
