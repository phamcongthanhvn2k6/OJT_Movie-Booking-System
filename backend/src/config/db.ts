import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/OJT_MovieBooking';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log(`⏳ Connecting to MongoDB at ${MONGODB_URI}...`);
      await mongoose.connect(MONGODB_URI);
      console.log('✅ MongoDB connected successfully.');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export { connectDB };
export default mongoose;
