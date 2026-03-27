import { query } from './config/db.js';

const alterDb = async () => {
    try {
        console.log("⏳ Dang cap nhat DB schema...");
        
        // Kiem tra thu table payments da co transaction_id chua
        try {
            await query('ALTER TABLE [payments] ADD transaction_id VARCHAR(255)');
            console.log("✅ Da them transaction_id vao table payments.");
        } catch (e: any) {
            console.log("⚠️ Bỏ qua loi (co the column da ton tai):", e.message);
        }

        process.exit(0);
    } catch (error) {
        console.error("Loi:", error);
        process.exit(1);
    }
};

alterDb();
