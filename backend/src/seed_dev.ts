import { query } from './config/db.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
    try {
        console.log("🌱 Bắt đầu thêm dữ liệu mô phỏng...");

        const safeQuery = async (queryStr: string, params: any[]) => {
            try {
                await query(queryStr, params);
            } catch (err: any) {
                console.log("   ⚠️ Bỏ qua (có thể đã tồn tại):", err.message);
            }
        };

        // 1. Tạo Users: 1 Admin, 1 User
        const hashedPassword = await bcrypt.hash('password123', 10);
        await safeQuery(`INSERT INTO [users] (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)`, ['user-1', 'Người Dùng Test', 'user@test.com', hashedPassword, 'user']);
        await safeQuery(`INSERT INTO [users] (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)`, ['admin-1', 'Quản Trị Viên', 'admin@test.com', hashedPassword, 'admin']);
        console.log("✅ Đã tạo tài khoản (Email: admin@test.com & user@test.com / Pass: password123)");

        // 2. Tạo Movie
        await safeQuery(`INSERT INTO [movies] (id, title, description, duration, release_date, poster_url, trailer_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            'movie-1',
            'Avengers: Endgame',
            'Trận chiến cuối cùng của biệt đội Avengers.',
            181,
            '2019-04-26',
            'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
            '',
            'NOW_SHOWING'
        ]);
        console.log("✅ Đã thêm phim (Avengers: Endgame)");

        // 3. Tạo Theater
        await safeQuery(`INSERT INTO [theaters] (id, name, address, city) VALUES (?, ?, ?, ?)`, ['theater-1', 'Rạp Beta Mỹ Đình', 'Tầng hầm B1, Tòa nhà Golden Palace', 'Hà Nội']);
        
        // 4. Tạo Screen
        await safeQuery(`INSERT INTO [screens] (id, theater_id, name, screen_type) VALUES (?, ?, ?, ?)`, ['screen-1', 'theater-1', 'Phòng chiếu số 1', '2D']);

        // 5. Tạo Seats
        for (let i = 1; i <= 10; i++) {
            await safeQuery(`INSERT INTO [seats] (id, screen_id, row_name, number, type, status) VALUES (?, ?, ?, ?, ?, ?)`, [`seat-${i}`, 'screen-1', 'A', i, 'Normal', 'AVAILABLE']);
        }
        console.log("✅ Đã thêm rạp, phòng chiếu và 10 ghế (A1 - A10)");

        // 6. Tạo Showtime
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(20, 0, 0, 0); 

        const endTime = new Date(tomorrow.getTime() + 181 * 60000); 
        const formatSQLDate = (d: Date) => d.toISOString().slice(0, 19).replace('T', ' ');

        await safeQuery(`INSERT INTO [showtimes] (id, movie_id, screen_id, theater_id, start_time, end_time, price) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            'showtime-1',
            'movie-1',
            'screen-1',
            'theater-1',
            formatSQLDate(tomorrow),
            formatSQLDate(endTime),
            85000
        ]);
        console.log("✅ Đã thêm suất chiếu lúc 20:00 ngày mai với giá vé 85.000");

        console.log("🎉 Hoàn tất quá trình seed dữ liệu!");
        process.exit(0);

    } catch (error) {
        console.error("Lỗi khi thêm dữ liệu:", error);
        process.exit(1);
    }
};

seed();
