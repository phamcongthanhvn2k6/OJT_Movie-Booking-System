import sql from 'mssql';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { modelsMap } from './models/index.js';

dotenv.config();

const mssqlConfig = {
  user: process.env.DB_USER || 'test',
  password: process.env.DB_PASSWORD || 'thanhtyou123@',
  server: process.env.DB_SERVER || 'DESKTOP-AUQETG8',
  database: process.env.DB_NAME || 'OJT_MovieBooking',
  options: {
    encrypt: false, // Set to true if connecting to Azure SQL
    trustServerCertificate: true // Trust local self-signed certificate
  }
};

const migrate = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected.');

    // 2. Connect to SQL Server
    console.log(`⏳ Connecting to SQL Server: ${mssqlConfig.server}...`);
    await sql.connect(mssqlConfig);
    console.log('✅ SQL Server connected.');

    // 3. Migrate each table
    const tables = Object.keys(modelsMap);

    for (const table of tables) {
      console.log(`⏳ Migrating table [${table}]...`);
      const Model = modelsMap[table];

      try {
        // Query all records from SQL Server
        const result = await sql.query(`SELECT * FROM [${table}]`);
        const rows = result.recordset;
        console.log(`   -> Found ${rows.length} rows in SQL Server.`);

        let count = 0;
        for (const row of rows) {
          // Clone the row and map primary key 'id' to MongoDB '_id'
          const doc = { ...row };
          if (doc.id) {
            doc._id = doc.id;
          }

          // Special mapping handling if needed (e.g. JSON strings to Object)
          if (table === 'events' && typeof doc.venues === 'string') {
            try {
              doc.venues = JSON.parse(doc.venues);
            } catch (err) {
              // Ignore if not a JSON string
            }
          }

          // Upsert into MongoDB
          await Model.replaceOne({ _id: doc._id }, doc, { upsert: true });
          count++;
        }

        console.log(`   ✅ Successfully migrated ${count}/${rows.length} documents.`);
      } catch (tableErr: any) {
        console.error(`   ❌ Failed to migrate table [${table}]:`, tableErr.message);
      }
    }

    console.log('🎉 Database migration finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
