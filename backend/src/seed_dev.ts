import { connectDB } from './config/db.js';
import { User, Movie, Theater, Screen, Seat, Showtime } from './models/index.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
    try {
        await connectDB();
        console.log("🌱 Bắt đầu thêm dữ liệu mô phỏng vào MongoDB...");

        // 1. Tạo Users: 1 Admin, 1 User
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await User.replaceOne(
            { _id: 'user-1' },
            { _id: 'user-1', username: 'Người Dùng Test', email: 'user@test.com', password: hashedPassword, role: 'user' },
            { upsert: true }
        );
        await User.replaceOne(
            { _id: 'admin-1' },
            { _id: 'admin-1', username: 'Quản Trị Viên', email: 'admin@test.com', password: hashedPassword, role: 'admin' },
            { upsert: true }
        );
        console.log("✅ Đã tạo tài khoản (Email: admin@test.com & user@test.com / Pass: password123)");

        // 2. Tạo Movie
        await Movie.replaceOne(
            { _id: 'movie-1' },
            {
                _id: 'movie-1',
                title: 'Avengers: Endgame',
                description: 'Trận chiến cuối cùng của biệt đội Avengers.',
                duration: 181,
                release_date: new Date('2019-04-26'),
                poster_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
                trailer_url: '',
                status: 'NOW_SHOWING'
            },
            { upsert: true }
        );
        console.log("✅ Đã thêm phim (Avengers: Endgame)");

        // 3. Tạo Theater
        await Theater.replaceOne(
            { _id: 'theater-1' },
            { _id: 'theater-1', name: 'Rạp Beta Mỹ Đình', address: 'Tầng hầm B1, Tòa nhà Golden Palace', city: 'Hà Nội' },
            { upsert: true }
        );
        
        // 4. Tạo Screen
        await Screen.replaceOne(
            { _id: 'screen-1' },
            { _id: 'screen-1', theater_id: 'theater-1', name: 'Phòng chiếu số 1', screen_type: '2D' },
            { upsert: true }
        );

        // 5. Tạo Seats
        for (let i = 1; i <= 10; i++) {
            await Seat.replaceOne(
                { _id: `seat-${i}` },
                { _id: `seat-${i}`, screen_id: 'screen-1', row_name: 'A', number: i, type: 'Normal', status: 'AVAILABLE' },
                { upsert: true }
            );
        }
        console.log("✅ Đã thêm rạp, phòng chiếu và 10 ghế (A1 - A10)");

        // 6. Tạo Showtime
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(20, 0, 0, 0); 

        const endTime = new Date(tomorrow.getTime() + 181 * 60000); 

        await Showtime.replaceOne(
            { _id: 'showtime-1' },
            {
                _id: 'showtime-1',
                movie_id: 'movie-1',
                screen_id: 'screen-1',
                theater_id: 'theater-1',
                start_time: tomorrow,
                end_time: endTime,
                price: 85000
            },
            { upsert: true }
        );
        console.log("✅ Đã thêm suất chiếu lúc 20:00 ngày mai với giá vé 85.000");

        console.log("🎉 Hoàn tất quá trình seed dữ liệu!");
        process.exit(0);

    } catch (error) {
        console.error("Lỗi khi thêm dữ liệu:", error);
        process.exit(1);
    }
};

seed();
