import { connectDB } from './config/db.js';
import { Showtime } from './models/index.js';

const fixShowtimes = async () => {
  try {
    await connectDB();
    console.log("⏳ Fetching all showtimes in MongoDB...");
    const showtimes = await Showtime.find({});
    console.log(`Found ${showtimes.length} showtimes.`);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let i = 0;
    for (const st of showtimes) {
      // Set to tomorrow at different hours (10:00, 13:00, 16:00, etc.)
      const start = new Date(tomorrow);
      start.setHours(10 + (i % 4) * 3, 0, 0, 0); 
      const end = new Date(start.getTime() + 120 * 60000); // 2 hours duration

      st.start_time = start;
      st.end_time = end;
      await st.save();
      console.log(`   Updated showtime [${st._id}] -> Start time: ${start.toLocaleString('vi-VN')}`);
      i++;
    }

    console.log("✅ All showtimes updated to tomorrow successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing showtimes:", err);
    process.exit(1);
  }
};

fixShowtimes();
