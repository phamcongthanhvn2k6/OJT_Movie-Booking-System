import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { modelsMap } from './models/index.js';

dotenv.config();

const initDatabase = async () => {
    try {
        await connectDB();
        
        console.log(`⏳ Initializing MongoDB database (Cleaning collections)...`);
        
        // Clear collections individually instead of dropping the database
        // to avoid MongoServerError: user is not allowed to do action [dropDatabase]
        for (const tableName of Object.keys(modelsMap)) {
            console.log(`⏳ Clearing collection: ${tableName}...`);
            await modelsMap[tableName].deleteMany({});
        }
        
        console.log(`✅ All collections cleared successfully!`);
        console.log(`✅ MongoDB initialized successfully!`);
        process.exit(0);
    } catch (error) {
        console.error(`❌ Error during setup:`, error);
        process.exit(1);
    }
};

initDatabase();
