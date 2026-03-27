import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './config/db.js';
import * as crypto from 'crypto';
// @ts-ignore
import PayOSLib from '@payos/node';
// @ts-ignore
const PayOS = PayOSLib.PayOS || PayOSLib.default || PayOSLib;
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const PAYOS_CLIENT_ID = process.env.Client_ID || "";
const PAYOS_API_KEY = process.env.API_Key || "";
const PAYOS_CHECKSUM_KEY = process.env.Checksum_Key || "";

const payos = new PayOS(
  PAYOS_CLIENT_ID,
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY
);

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
      const conditions = filters.map((key) => {
        const val = req.query[key];
        if (Array.isArray(val)) {
          const placeholders = val.map(() => '?').join(', ');
          values.push(...val.map(String));
          return `[${key}] IN (${placeholders})`;
        } else {
          values.push(String(val));
          return `[${key}] = ?`;
        }
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
 * Get User Bookings with Ticket Details
 * GET /api/user-bookings/:userId
 */
app.get('/api/user-bookings/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const queryStr = `
      SELECT 
          b.id as booking_id,
          b.created_at as booking_time,
          b.total_price_movie as total_price,
          p.payment_status,
          p.payment_method,
          p.transaction_id,
          m.title as movie_title,
          m.image as poster_url,
          st.start_time,
          st.end_time,
          th.name as theater_name,
          scr.name as screen_name,
          STRING_AGG(s.seat_number, ', ') as seat_numbers
      FROM bookings b
      LEFT JOIN payments p ON p.booking_id = b.id
      LEFT JOIN showtimes st ON b.showtime_id = st.id
      LEFT JOIN movies m ON st.movie_id = m.id
      LEFT JOIN screens scr ON st.screen_id = scr.id
      LEFT JOIN theaters th ON scr.theater_id = th.id
      LEFT JOIN booking_seats bs ON bs.booking_id = b.id
      LEFT JOIN seats s ON bs.seat_id = s.id
      WHERE b.user_id = ?
      GROUP BY 
          b.id, b.created_at, b.total_price_movie, 
          p.payment_status, p.payment_method, p.transaction_id,
          m.title, m.image, 
          st.start_time, st.end_time,
          th.name, scr.name
      ORDER BY b.created_at DESC
    `;
    const result = await query(queryStr, [userId]);
    res.json(result);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/**
 * Payment Integration using PayOS
 */
app.post('/api/payment/create', async (req, res) => {
  const { orderId, amount, description } = req.body;
  
  try {
    // orderCode của PayOS cần là số nguyên, ta dùng số ngẫu nhiên 6 chữ số ghép vào
    const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 100));

    // Cập nhật transaction_id vào dữ liệu Payment để đối chiếu khi Webhook trả về
    await query(`UPDATE [payments] SET transaction_id = ? WHERE booking_id = ?`, [orderCode.toString(), orderId]);

    const body = {
        orderCode: orderCode,
        amount: amount,
        description: description.substring(0, 25), // PayOS giới hạn độ dài mô tả
        returnUrl: `http://localhost:5173/payment-success`,
        cancelUrl: `http://localhost:5173/payment-cancel`
    };

    const paymentLinkRes = await payos.createPaymentLink(body);

    return res.status(200).json({
      success: true,
      checkoutUrl: paymentLinkRes.checkoutUrl
    });

  } catch (error) {
    const err = error as Error;
    console.error("Lỗi tạo link thanh toán PayOS:", err.message);
    return res.status(500).json({ success: false, message: "Lỗi tạo link thanh toán", error: err.message });
  }
});

app.post('/api/payment/webhook', async (req, res) => {
  try {
    // log webhook content
    console.log("Receive webhook from PayOS");
    
    // verify webhook
    const webhookData = await payos.verifyPaymentWebhookData(req.body);

    if (req.body.code !== '00') {
       return res.status(200).json({ success: true, message: "Webhook không phải là sự kiện thành công" });
    }

    // Check if payment exists
    const paymentCheck = await query(`SELECT * FROM [payments] WHERE transaction_id = ?`, [webhookData.orderCode.toString()]);
      
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
            payment_method = 'PayOS', 
            payment_time = GETDATE(), 
            updated_at = GETDATE() 
        WHERE id = ?
      `, [payment.id]);

    console.log(`[Webhook] Payment ${payment.id} processed successfully.`);
    return res.status(200).json({ success: true });
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
