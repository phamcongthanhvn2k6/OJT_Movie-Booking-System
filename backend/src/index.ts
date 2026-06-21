import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { modelsMap } from './models/index.js';
import * as crypto from 'crypto';
// @ts-ignore
import PayOSLib from '@payos/node';
// @ts-ignore
const PayOS = PayOSLib.PayOS || PayOSLib.default || PayOSLib;

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

const ALLOWED_TABLES = Object.keys(modelsMap);

/**
 * Generic GET Endpoint mimicking json-server
 * GET /:table
 */
app.get('/:table', async (req, res) => {
  const table = req.params.table;
  if (!ALLOWED_TABLES.includes(table)) {
    return res.status(404).json({ error: "Table not found." });
  }

  const Model = modelsMap[table];

  try {
    const queryObj: any = {};
    for (const key in req.query) {
      if (['_sort', '_order', '_limit', '_page', 'q'].includes(key)) continue;
      
      const val = req.query[key];
      // Map 'id' parameter to '_id' for MongoDB matching
      const cleanKey = key === 'id' ? '_id' : key;
      
      if (Array.isArray(val)) {
        queryObj[cleanKey] = { $in: val };
      } else {
        queryObj[cleanKey] = val;
      }
    }

    let query = Model.find(queryObj);
    
    if (req.query._sort && typeof req.query._sort === 'string') {
      const order = req.query._order === 'desc' ? -1 : 1;
      query = query.sort({ [req.query._sort]: order });
    }

    const items = await query;
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

  const Model = modelsMap[table];

  try {
    const item = await Model.findById(id);
    if (!item) {
      return res.status(404).json({});
    }
    res.json(item);
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
    const bookings = await modelsMap.bookings.find({ user_id: userId }).sort({ booking_time: -1 });
    const results = [];

    for (const booking of bookings) {
      const payment = await modelsMap.payments.findOne({ booking_id: booking._id });
      const showtime = await modelsMap.showtimes.findById(booking.showtime_id);
      
      let movie = null;
      let screen = null;
      let theater = null;

      if (showtime) {
        movie = await modelsMap.movies.findById(showtime.movie_id);
        screen = await modelsMap.screens.findById(showtime.screen_id);
        if (screen) {
          theater = await modelsMap.theaters.findById(screen.theater_id);
        }
      }

      const bookingSeats = await modelsMap.booking_seats.find({ booking_id: booking._id });
      const seatNumbers: string[] = [];

      for (const bs of bookingSeats) {
        const seat = await modelsMap.seats.findById(bs.seat_id);
        if (seat) {
          const seatNum = (seat as any).seat_number || (seat.row_name && seat.number ? `${seat.row_name}${seat.number}` : seat._id);
          seatNumbers.push(seatNum);
        }
      }

      results.push({
        booking_id: booking._id,
        booking_time: booking.booking_time,
        total_price: booking.total_price_movie || booking.total_price,
        payment_status: payment?.payment_status || 'PENDING',
        payment_method: payment?.payment_method || null,
        transaction_id: payment?.transaction_id || null,
        movie_title: movie?.title || null,
        poster_url: movie?.poster_url || null,
        start_time: showtime?.start_time || null,
        end_time: showtime?.end_time || null,
        theater_name: theater?.name || null,
        screen_name: screen?.name || null,
        seat_numbers: seatNumbers.join(', ')
      });
    }

    res.json(results);
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
    const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 100));

    // Update payment record with the transaction_id (orderCode)
    await modelsMap.payments.updateOne(
      { booking_id: orderId },
      { $set: { transaction_id: orderCode.toString(), updated_at: new Date() } }
    );

    const body = {
        orderCode: orderCode,
        amount: amount,
        description: description.substring(0, 25),
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
    console.log("Receive webhook from PayOS");
    const webhookData = await payos.verifyPaymentWebhookData(req.body);

    if (req.body.code !== '00') {
       return res.status(200).json({ success: true, message: "Webhook không phải là sự kiện thành công" });
    }

    const payment = await modelsMap.payments.findOne({ transaction_id: webhookData.orderCode.toString() });
      
    if (!payment) {
        return res.status(404).send("Payment record not found");
    }
    
    if (payment.amount !== webhookData.amount) {
       await modelsMap.payments.updateOne(
         { _id: payment._id },
         { $set: { payment_status: 'PAYMENT_MISMATCH', updated_at: new Date() } }
       );
       return res.status(200).send("Amount mismatch handled");
    }
    
    await modelsMap.payments.updateOne(
      { _id: payment._id },
      {
        $set: {
          payment_status: 'COMPLETED',
          payment_method: 'PayOS',
          payment_time: new Date(),
          updated_at: new Date()
        }
      }
    );

    console.log(`[Webhook] Payment ${payment._id} processed successfully.`);
    return res.status(200).json({ success: true });
  } catch (error) {
    const err = error as Error;
    console.error("[Webhook Error]:", err.message);
    return res.status(500).send("Internal Server Error processing webhook");
  }
});

/**
 * Generic POST Endpoint
 * POST /:table
 */
app.post('/:table', async (req, res) => {
  const table = req.params.table;
  if (!ALLOWED_TABLES.includes(table)) {
    return res.status(404).json({ error: "Table not found." });
  }

  const Model = modelsMap[table];
  
  try {
     const body = req.body;
     
     if (!body.id) {
         body.id = crypto.randomUUID().substring(0, 8);
     }
     
     // Set string ID as the primary key _id in MongoDB
     const doc = { ...body, _id: body.id };
     const newDoc = new Model(doc);
     await newDoc.save();
     
     res.status(201).json(newDoc);
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

  const Model = modelsMap[table];
  
  try {
     const body = req.body;
     const updated = await Model.findByIdAndUpdate(id, { $set: body }, { new: true });
     
     if (!updated) {
       return res.status(404).json({ error: "Document not found" });
     }
     res.status(200).json(updated);
  } catch(err) {
      console.error(`Error updating ${table}:`, err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
      console.log(`🚀 API Server running on port ${PORT}`);
      console.log(`✨ Replacing json-server. Data driven by MongoDB Database.`);
  });
};

startServer();
