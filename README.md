# OJT_MovieBooking - Hệ thống đặt vé xem phim

Dự án này đã được **tái cấu trúc thành 2 module độc lập**: `frontend` (React + Vite) và `backend` (Node.js + Express).

## Hướng dẫn cài đặt và chạy

### 1. Backend (API & Cơ sở dữ liệu)
```bash
cd backend
npm install
```
Trong này đã có sẵn file `.env` kết nối tới SQL Server và PayOS.

Để khởi động Backend Server (mặc định tại cổng `5000`):
```bash
npm run dev
```

*(Lưu ý: Nếu chưa có database, bạn có thể chạy `npm run db:init` và `npm run db:seed` để tạo tự động).*

---

### 2. Frontend (Giao diện người dùng)
Mở một cửa sổ Terminal mới:
```bash
cd frontend
npm install
```
Trong này có chứa `.env` khai báo biến môi trường cho Vite (`VITE_LOCAL=http://localhost:5000` v.v...).

Để khởi động giao diện React (mặc định tại cổng `5173`):
```bash
npm run dev
```
Sau đó truy cập link localhost:5173 trên trình duyệt để sử dụng.

### 3. Đăng Nhập 
-USER: 
- Email: [user@gmail.com]
- Password: [password123]

-ADMIN: 
- Email: [admin@gmail.com]
- Password: [password123]
