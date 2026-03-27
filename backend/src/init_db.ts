import sql from 'msnodesqlv8';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const server = process.env.DB_SERVER || 'DESKTOP-AUQETG8';
const user = process.env.DB_USER || 'test';
const password = process.env.DB_PASSWORD || '';
const targetDb = process.env.DB_NAME || 'OJT_MovieBooking';

// Connection string to 'master' database to create the target database if missing
const masterConnStr = `Driver={ODBC Driver 18 for SQL Server};Server=${server};Database=master;Uid=${user};Pwd=${password};TrustServerCertificate=Yes;`;

// Connection string to the target database to create tables
const targetConnStr = `Driver={ODBC Driver 18 for SQL Server};Server=${server};Database=${targetDb};Uid=${user};Pwd=${password};TrustServerCertificate=Yes;`;

const query = (connStr: string, sqlQuery: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        sql.query(connStr, sqlQuery, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

const initDatabase = async () => {
    try {
        console.log(`⏳ Connecting to master database on ${server} as ${user}...`);
        
        // 1. Create database if it doesn't exist
        console.log(`⏳ Checking if database [${targetDb}] exists...`);
        const checkDbQuery = `SELECT name FROM master.dbo.sysdatabases WHERE name = N'${targetDb}'`;
        const dbExists = await query(masterConnStr, checkDbQuery);
        
        if (dbExists.length === 0) {
            console.log(`⏳ Creating database [${targetDb}]...`);
            await query(masterConnStr, `CREATE DATABASE [${targetDb}]`);
            console.log(`✅ Database [${targetDb}] created successfully.`);
            
            // Wait a little bit for DB to be fully ready
            await new Promise(res => setTimeout(res, 2000));
        } else {
            console.log(`✅ Database [${targetDb}] already exists.`);
        }

        // 2. Create tables
        console.log(`⏳ Connecting to [${targetDb}] and creating tables...`);
        
        const tablesSchema = `
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
            CREATE TABLE [users] (
                id VARCHAR(50) PRIMARY KEY,
                username NVARCHAR(100),
                email VARCHAR(255),
                password VARCHAR(255),
                role VARCHAR(50),
                created_at DATETIME DEFAULT GETDATE(),
                updated_at DATETIME DEFAULT GETDATE()
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='genres' AND xtype='U')
            CREATE TABLE [genres] (
                id VARCHAR(50) PRIMARY KEY,
                name NVARCHAR(100)
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='theaters' AND xtype='U')
            CREATE TABLE [theaters] (
                id VARCHAR(50) PRIMARY KEY,
                name NVARCHAR(255),
                address NVARCHAR(MAX),
                city NVARCHAR(100)
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='movies' AND xtype='U')
            CREATE TABLE [movies] (
                id VARCHAR(50) PRIMARY KEY,
                title NVARCHAR(255),
                description NVARCHAR(MAX),
                duration INT,
                release_date DATE,
                poster_url NVARCHAR(MAX),
                trailer_url NVARCHAR(MAX),
                status VARCHAR(50)
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='screens' AND xtype='U')
            CREATE TABLE [screens] (
                id VARCHAR(50) PRIMARY KEY,
                theater_id VARCHAR(50),
                name NVARCHAR(100),
                screen_type VARCHAR(50)
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='showtimes' AND xtype='U')
            CREATE TABLE [showtimes] (
                id VARCHAR(50) PRIMARY KEY,
                movie_id VARCHAR(50),
                screen_id VARCHAR(50),
                theater_id VARCHAR(50),
                start_time DATETIME,
                end_time DATETIME,
                price INT
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='seats' AND xtype='U')
            CREATE TABLE [seats] (
                id VARCHAR(50) PRIMARY KEY,
                screen_id VARCHAR(50),
                row_name VARCHAR(10),
                number INT,
                type VARCHAR(50),
                status VARCHAR(50)
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='bookings' AND xtype='U')
            CREATE TABLE [bookings] (
                id VARCHAR(50) PRIMARY KEY,
                user_id VARCHAR(50),
                showtime_id VARCHAR(50),
                total_price INT,
                booking_time DATETIME DEFAULT GETDATE(),
                status VARCHAR(50)
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='booking_seats' AND xtype='U')
            CREATE TABLE [booking_seats] (
                id VARCHAR(50) PRIMARY KEY,
                booking_id VARCHAR(50),
                seat_id VARCHAR(50),
                price INT
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='payments' AND xtype='U')
            CREATE TABLE [payments] (
                id VARCHAR(50) PRIMARY KEY,
                booking_id VARCHAR(50),
                amount INT,
                payment_status VARCHAR(50),
                payment_method VARCHAR(50),
                payment_time DATETIME,
                transaction_id VARCHAR(255),
                created_at DATETIME DEFAULT GETDATE(),
                updated_at DATETIME DEFAULT GETDATE()
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ticket_prices' AND xtype='U')
            CREATE TABLE [ticket_prices] (
                id VARCHAR(50) PRIMARY KEY,
                seat_type VARCHAR(50),
                screen_type VARCHAR(50),
                day_type VARCHAR(50),
                price INT
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='events' AND xtype='U')
            CREATE TABLE [events] (
                id VARCHAR(50) PRIMARY KEY,
                title NVARCHAR(255),
                description NVARCHAR(MAX),
                image_url NVARCHAR(MAX),
                start_date DATE,
                end_date DATE,
                venues NVARCHAR(MAX)
            );

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='News' AND xtype='U')
            CREATE TABLE [News] (
                id VARCHAR(50) PRIMARY KEY,
                title NVARCHAR(MAX),
                content NVARCHAR(MAX),
                image_url NVARCHAR(MAX),
                created_at DATETIME DEFAULT GETDATE()
            );
        `;

        await query(targetConnStr, tablesSchema);
        console.log(`✅ All tables created successfully in [${targetDb}]!`);
        console.log(`🚀 You are now ready to run the server.`);
        process.exit(0);
    } catch (error) {
        console.error(`❌ Error during setup:`, error);
        process.exit(1);
    }
};

initDatabase();
