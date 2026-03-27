import sql from 'msnodesqlv8';
import dotenv from 'dotenv';
import util from 'util';

dotenv.config();

// Using SQL Server Authentication (Username and Password) instead of Windows Authentication
const connectionString = `Driver={ODBC Driver 18 for SQL Server};Server=${process.env.DB_SERVER || 'DESKTOP-AUQETG8'};Database=${process.env.DB_NAME || 'OJT_MovieBooking'};Uid=${process.env.DB_USER || 'test'};Pwd=${process.env.DB_PASSWORD || ''};TrustServerCertificate=Yes;`;

// Helper to wrap callbacks into promises
const query = async (queryStr: string, params: any[] = []) => {
  return new Promise<any>((resolve, reject) => {
    sql.query(connectionString, queryStr, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

export { query };
