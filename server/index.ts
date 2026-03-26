import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './config/db.js';
import * as crypto from 'crypto';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.VIETQR_SECRET_KEY || "yoursecretkeyhere";

app.use(cors());
app.use(express.json());

// Tables allowed for dynamic querying to prevent SQL injection
const ALLOWED_TABLES = [
  'users', 'genres', 'theaters', 'screens', 'seats', 'movies', 
  'showtimes', 'booking_seats', 'payments', 'bookings', 
  'ticket_prices', 'events', 'News'
];

/**
 * Generic GET Endpoint mimicking json-server
 * GET /:table
 * Supports query params like /showtimes?movie_id=1
 */
app.get('/:table', async (req, res) => {
  const table = req.params.table;
  if (!ALLOWED_TABLES.includes(table)) {
    return res.status(404).json({ error: "Table not found." });
  }

  try {
    let queryStr = `SELECT * FROM [${table}]`;
    const queryParams = Object.keys(req.query);
    
    // Simple WHERE clause for exact matches
    const filters = queryParams.filter(key => key !== '_sort' && key !== '_order' && key !== '_limit' && key !== '_page' && key !== 'q');
    
    const values: string[] = [];
    
    if (filters.length > 0) {
      const conditions = filters.map((key, index) => {
        values.push(String(req.query[key]));
        return `[${key}] = ?`;
      });
      queryStr += ` WHERE ${conditions.join(' AND ')}`;
    }

    const sort = req.query._sort;
    const order = req.query._order === 'desc' ? 'DESC' : 'ASC';
    if (sort && typeof sort === 'string') {
        const cleanSort = sort.replace(/[^a-zA-Z0-9_]/g, '');
        queryStr += ` ORDER BY [${cleanSort}] ${order}`;
    }

    const result = await query(queryStr, values);
    
    let items = result;
    if (table === 'events') {
         items = items.map((item: { venues?: string; [key: string]: unknown }) => ({
            ...item,
            venues: item.venues ? JSON.parse(item.venues) : []
         }))
    }
    
    res.json(items);
  } catch (err) {
    console.error(`Error fetching ${table}:`, err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Generic GET By ID Endpoint
 * GET /:table/:id
 */
app.get('/:table/:id', async (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  
  if (!ALLOWED_TABLES.includes(table)) {
    return res.status(404).json({ error: "Table not found." });
  }

  try {
    const result = await query(`SELECT * FROM [${table}] WHERE id = ?`, [id]);
      
    if (result.length === 0) {
      return res.status(404).json({});
    }
    res.json(result[0]);
  } catch (err) {
    console.error(`Error fetching ${table} by id:`, err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/**
 * Payment Integration from payment.server.ts
 */
app.post('/api/payment/create', async (req, res) => {
  const { orderId, amount, description } = req.body;
  
  try {
    const response = await fetch('https://api.vietqr.io/v2/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountNo: "27072006", 
          accountName: "PHAM CONG THANH", 
          acqId: "970403", 
          amount: amount,
          addInfo: description, 
          format: "text",
          template: "qr_only"
        })
    });

    const data = await response.json();
    if (data.code === '00') {
      return res.status(200).json({
        success: true,
        qrCode: data.data.qrDataURL,
        checkoutUrl: `http://localhost:5173/checkout/${orderId}` 
      });
    } else {
      return res.status(400).json({ success: false, message: data.desc });
    }

  } catch (error) {
    const err = error as Error;
    console.error("Lỗi tạo mã QR:", err.message);
    return res.status(500).json({ success: false, message: "Lỗi tạo mã QR", error: err.message });
  }
});

app.post('/api/payment/webhook', async (req, res) => {
  const webhookData = req.body;

  const dataToVerify = `${webhookData.amount}-${webhookData.orderCode}-${webhookData.description}`;
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(dataToVerify)
    .digest('hex');

  if (webhookData.signature && webhookData.signature !== expectedSignature) {
    return res.status(400).send("Signature Invalid");
  }

  try {
    // Check if payment exists
    const paymentCheck = await query(`SELECT * FROM [payments] WHERE booking_id = ?`, [webhookData.orderCode.toString()]);
      
    if (paymentCheck.length === 0) {
        return res.status(404).send("Payment record not found");
    }
    
    const payment = paymentCheck[0];
    
    if (payment.amount !== webhookData.amount) {
       await query(`UPDATE [payments] SET payment_status = 'PAYMENT_MISMATCH', updated_at = GETDATE() WHERE id = ?`, [payment.id]);
       return res.status(200).send("Amount mismatch handled");
    }
    
    await query(`
        UPDATE [payments] 
        SET payment_status = 'COMPLETED', 
            payment_method = 'VietQR', 
            payment_time = GETDATE(), 
            updated_at = GETDATE() 
        WHERE id = ?
      `, [payment.id]);

    console.log(`[Webhook] Payment ${payment.id} processed successfully.`);
    return res.status(200).send("Webhook received and processed");
  } catch (error) {
    const err = error as Error;
    console.error("[Webhook Error]:", err.message);
    return res.status(500).send("Internal Server Error processing webhook");
  }
});


/**
 * Generic POST Enpoint
 * POST /:table
 */
app.post('/:table', async (req, res) => {
  const table = req.params.table;
  if (!ALLOWED_TABLES.includes(table)) {
    return res.status(404).json({ error: "Table not found." });
  }
  
  try {
     const body = req.body;
     
     if (!body.id) {
         body.id = crypto.randomUUID().substring(0, 8);
     }
     
     const keys = Object.keys(body);
     const values = keys.map(k => body[k]);
     const placeholders = keys.map(() => '?').join(', ');
     
     const queryStr = `INSERT INTO [${table}] ([${keys.join('], [')}]) VALUES (${placeholders})`;
     await query(queryStr, values);
     
     res.status(201).json(body);
  } catch(err) {
      console.error(`Error inserting into ${table}:`, err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Generic PATCH Endpoint
 * PATCH /:table/:id
 */
app.patch('/:table/:id', async (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  if (!ALLOWED_TABLES.includes(table)) {
    return res.status(404).json({ error: "Table not found." });
  }
  
  try {
     const body = req.body;
     const keys = Object.keys(body);
     if (keys.length === 0) return res.status(200).json({});
     
     const sets = keys.map(k => `[${k}] = ?`);
     const values = keys.map(k => body[k]);
     values.push(id); // for the WHERE id = ?
     
     const queryStr = `UPDATE [${table}] SET ${sets.join(', ')} WHERE id = ?`;
     await query(queryStr, values);
     
     const updated = await query(`SELECT * FROM [${table}] WHERE id = ?`, [id]);
     res.status(200).json(updated[0] || {});
  } catch(err) {
      console.error(`Error updating ${table}:`, err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`✨ Replacing json-server. Data driven by SQL Server Database: ${process.env.DB_NAME}`);
});
