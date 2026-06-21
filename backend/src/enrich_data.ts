import { connectDB } from './config/db.js';
import { Movie, Showtime, Seat, Screen, News, Event } from './models/index.js';

const enrich = async () => {
  try {
    await connectDB();
    console.log("🌱 Starting database enrichment...");

    // 1. Fix Movie Poster Images and basic details
    console.log("⏳ Enriching movies data...");
    const movies = await Movie.find({});
    
    // Curated high quality posters
    const posterImages = [
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", // Avengers
      "https://image.tmdb.org/t/p/w500/r2J02Z2OpOJ21eUJrGwjK24j4mJ.jpg", // The Dark Knight
      "https://image.tmdb.org/t/p/w500/8GxF06ZgH5Ls5sZh2nG06UgKB2O.jpg", // Oppenheimer
      "https://image.tmdb.org/t/p/w500/iuFNmZ51jW6xKzvS3tww36i4GjA.jpg", // Barbie
      "https://image.tmdb.org/t/p/w500/qJ2tW65Gg3KeymSKKqt54RjgrJ9.jpg", // Inside Out 2
      "https://image.tmdb.org/t/p/w500/vc5pX1y5qTrm726859n22ty6f29.jpg", // Spiderman
      "https://image.tmdb.org/t/p/w500/w8661QoTqafo04r6UR948G94ea9.jpg", // Dune 2
      "https://image.tmdb.org/t/p/w500/dB6Krk806zeqd045hticQE21jAb.jpg"  // Toy Story
    ];

    let pIdx = 0;
    for (const m of movies) {
      // If image/poster_url is missing or invalid, assign a beautiful TMDB URL
      if (!m.image || m.image.startsWith('C:') || m.image.includes('placeholder')) {
        m.image = posterImages[pIdx % posterImages.length];
      }
      if (!m.poster_url || m.poster_url.startsWith('C:') || m.poster_url.includes('placeholder')) {
        m.poster_url = posterImages[pIdx % posterImages.length];
      }
      
      // Fill missing fields to prevent UI crash
      m.type = m.type || "2D";
      m.genre = m.genre || "Hành Động, Phiêu Lưu";
      m.country = m.country || "Mỹ";
      m.actors = m.actors || "Robert Downey Jr., Chris Evans, Scarlett Johansson";
      m.author = m.author || "Anthony Russo, Joe Russo";
      m.duration = m.duration || 120;
      m.status = m.status || "NOW_SHOWING";
      
      await m.save();
      pIdx++;
    }
    console.log(`✅ Fixed details & posters for ${movies.length} movies.`);

    // 2. Generate Showtimes for ALL movies
    console.log("⏳ Generating showtimes for all movies...");
    const screens = await Screen.find({});
    if (screens.length === 0) {
      console.log("⚠️ No screens found. Cannot create showtimes.");
    } else {
      // Clear existing showtimes to build a clean set
      await Showtime.deleteMany({});
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      let stIdx = 0;
      for (const m of movies) {
        // Create 2 showtimes for each movie
        for (let timeOffset = 0; timeOffset < 2; timeOffset++) {
          const screen = screens[stIdx % screens.length];
          
          const start = new Date(tomorrow);
          // Distribute times: 9:00, 12:00, 15:00, 18:00, 21:00
          start.setHours(9 + (stIdx % 5) * 3, 0, 0, 0); 
          const end = new Date(start.getTime() + (m.duration || 120) * 60000);
          
          const showtimeId = `showtime-gen-${m._id}-${timeOffset}`;
          await Showtime.replaceOne(
            { _id: showtimeId },
            {
              _id: showtimeId,
              movie_id: m._id,
              screen_id: screen._id,
              theater_id: screen.theater_id || 'theater-1',
              start_time: start,
              end_time: end,
              price: 85000 + (timeOffset * 15000)
            },
            { upsert: true }
          );
          stIdx++;
        }
      }
      console.log(`✅ Generated ${stIdx} showtimes across all movies.`);
    }

    // 3. Generate Full Seats (A1 to J10) for ALL screens
    console.log("⏳ Generating seats (A1 to J10) for all screens...");
    let seatCount = 0;
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    // Clear old seats to avoid conflicts
    await Seat.deleteMany({});
    
    for (const scr of screens) {
      for (const r of rows) {
        for (let num = 1; num <= 10; num++) {
          const seatId = `seat-${scr._id}-${r}${num}`;
          const seatType = (r === 'I' || r === 'J') ? 'VIP' : 'STANDARD';
          
          await Seat.replaceOne(
            { _id: seatId },
            {
              _id: seatId,
              screen_id: scr._id,
              row_name: r,
              number: num,
              type: seatType,
              status: 'AVAILABLE'
            },
            { upsert: true }
          );
          seatCount++;
        }
      }
    }
    console.log(`✅ Generated ${seatCount} seats across all ${screens.length} screens.`);

    // 4. Fix News and Events Broken Image URLs
    console.log("⏳ Fixing News and Events images...");
    const newsList = await News.find({});
    const newsImages = [
      "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766537754/khuyenmai1_m77if4.png",
      "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766537754/khuyenmai2_kzrj9h.png"
    ];
    let nIdx = 0;
    for (const n of newsList) {
      if (!n.image_url || n.image_url.startsWith('C:') || n.image_url.includes('placeholder')) {
        n.image_url = newsImages[nIdx % newsImages.length];
        await n.save();
      }
      nIdx++;
    }

    const eventList = await Event.find({});
    const eventImages = [
      "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766537776/sukien1_rwvpmm.png",
      "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766537778/sukien2_mk6mml.png",
      "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766537780/sukien3_vomucs.png",
      "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766537781/sukien4_ssgtun.png",
      "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766537784/sukien5_m4o4ae.png",
      "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766537786/sukien6_fzkzqv.png"
    ];
    let eIdx = 0;
    for (const e of eventList) {
      if (!e.image_url || e.image_url.startsWith('C:') || e.image_url.includes('placeholder')) {
        e.image_url = eventImages[eIdx % eventImages.length];
        await e.save();
      }
      eIdx++;
    }
    console.log("✅ News and Events image URLs repaired.");

    console.log("🎉 Database enrichment finished successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Enrichment failed:", err);
    process.exit(1);
  }
};

enrich();
