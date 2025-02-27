import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

interface ConnectDBOptions extends ConnectOptions {
  dbUri: string;
}

const dbUri: string = process.env.MONGODB_URI ?? '';
const connectDB = async (options?: ConnectDBOptions): Promise<void> => {
  try {
    const conn = await mongoose.connect(dbUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
