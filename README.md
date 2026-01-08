# 🎬 Movie Booking Management System (Hệ Thống Quản Lý Đặt Vé Xem Phim)

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Redux%20%7C%20NodeJS-blueviolet)

## 📖 Tổng quan (Overview)

[cite_start]**Hệ thống Quản lý Đặt Vé Xem Phim Online** là một giải pháp phần mềm toàn diện được thiết kế để số hóa quy trình vận hành rạp chiếu phim[cite: 6]. [cite_start]Hệ thống phục vụ ba đối tượng chính: Khách vãng lai (Guest), Thành viên (User) và Quản trị viên (Admin) [cite: 30-35].

[cite_start]Mục tiêu chính của hệ thống là cho phép người dùng xem phim, chọn ghế, thanh toán trực tuyến và nhận vé điện tử, đồng thời cung cấp công cụ quản lý mạnh mẽ cho chủ rạp về phim, lịch chiếu, doanh thu và người dùng[cite: 7].

---

## 🚀 Tính năng Chính (Key Features)

### 1. Phân hệ Người dùng (Client Side)

#### 👤 Guest (Khách chưa đăng nhập)
* [cite_start]**Tra cứu phim:** Xem danh sách phim đang chiếu, sắp chiếu với đầy đủ thông tin (Poster, Trailer, Diễn viên, Đạo diễn, Thời lượng...)[cite: 58, 64].
* [cite_start]**Tìm kiếm & Lọc:** Tìm kiếm phim theo tên, lọc theo thể loại, định dạng (2D/3D), ngày chiếu và rạp chiếu[cite: 68].
* [cite_start]**Xem lịch chiếu:** Tra cứu suất chiếu chi tiết theo từng rạp và ngày cụ thể[cite: 71].
* [cite_start]**Đăng ký/Đăng nhập:** Tạo tài khoản qua Email/SĐT, xác thực OTP qua Email [cite: 40-43].

#### 🎫 User (Thành viên đã đăng nhập)
* **Quy trình Đặt vé (Booking Flow):**
    * [cite_start]Chọn Phim -> Chọn Rạp -> Chọn Suất chiếu [cite: 85-88].
    * **Chọn ghế Real-time:** Xem sơ đồ ghế trực quan (Ghế trống, Đã đặt, Đang giữ). [cite_start]Hỗ trợ nhiều loại ghế (Standard, VIP, Sweetbox) [cite: 96-100].
    * [cite_start]**Giữ ghế tạm thời:** Hệ thống tự động giữ ghế trong 5 phút để tránh trùng lặp khi thanh toán[cite: 91].
* [cite_start]**Thanh toán Đa kênh:** Tích hợp cổng thanh toán VNPAY, VietQR, PayPal, Momo [cite: 106-109].
* [cite_start]**Vé điện tử (E-Ticket):** Nhận vé qua Email và lưu trong hệ thống bao gồm Mã QR để check-in [cite: 118-121].
* **Quản lý cá nhân:**
    * [cite_start]Xem lịch sử đặt vé (Vé đã xem, chưa xem, đã hủy)[cite: 129].
    * [cite_start]Hủy vé tự động (Hoàn tiền nếu đã thanh toán, xóa đơn nếu chưa thanh toán) theo chính sách rạp [cite: 139-140].
    * [cite_start]Cập nhật hồ sơ cá nhân và ảnh đại diện[cite: 50, 55].

### 2. Phân hệ Quản trị (Admin Side)

* [cite_start]**Quản lý Phim (Movies):** Thêm/Sửa/Xóa phim, cập nhật trạng thái (Đang chiếu/Ngừng chiếu) [cite: 164-169].
* [cite_start]**Quản lý Rạp & Phòng chiếu (Theaters & Screens):** Thiết lập hệ thống rạp, thêm phòng chiếu, cấu hình sức chứa ghế[cite: 184, 194].
* [cite_start]**Quản lý Ghế (Seat Map):** Thiết lập sơ đồ ghế cho từng phòng, định nghĩa loại ghế (Standard/VIP) [cite: 203-205].
* **Xếp Lịch Chiếu (Showtimes):**
    * [cite_start]Tự động kiểm tra xung đột thời gian và phòng chiếu[cite: 218].
    * [cite_start]Lên lịch chiếu linh hoạt theo phim và rạp [cite: 214-217].
* [cite_start]**Cấu hình Giá vé (Dynamic Pricing):** Thiết lập giá vé thay đổi theo: Loại ghế, Định dạng phim (2D/3D), Ngày (Thường/Cuối tuần/Lễ), Khung giờ [cite: 226-230].
* [cite_start]**Báo cáo & Thống kê:** Biểu đồ doanh thu theo phim, rạp, ngày/tháng và tỷ lệ lấp đầy phòng chiếu [cite: 279-283].
* [cite_start]**Soát vé (Check-in):** Quét mã QR để xác thực vé hợp lệ tại quầy [cite: 387-392].

---

## 🧠 Quy tắc Nghiệp vụ (Business Rules)

1.  **Cơ chế Giữ ghế (Seat Locking):** Khi người dùng chọn ghế, hệ thống sẽ khóa ghế đó trong bảng `booking_seat` trong 5 phút. [cite_start]Nếu quá thời gian không thanh toán, ghế sẽ được giải phóng[cite: 309].
2.  [cite_start]**Tính giá vé:** Giá vé = Giá cơ bản (theo loại phim/ngày/giờ) + Phụ thu (theo loại ghế VIP/Sweetbox) [cite: 311-315].
3.  **Chính sách Hủy vé:**
    * [cite_start]Chỉ cho phép hủy trước giờ chiếu (theo quy định rạp)[cite: 138].
    * [cite_start]Nếu `payment_status` = SUCCESS: Thực hiện Refund (Hoàn tiền)[cite: 139].
    * [cite_start]Nếu `payment_status` = PENDING: Xóa Booking, hủy giữ ghế[cite: 140].
4.  **Quy trình Check-in:** Nhân viên quét QR -> Hệ thống kiểm tra: Đúng suất chiếu? Vé chưa sử dụng? [cite_start]-> Cập nhật trạng thái `CHECKED_IN` [cite: 388-392].

---

## 🗄️ Thiết kế Cơ sở dữ liệu (Database Schema)

Hệ thống sử dụng cơ sở dữ liệu quan hệ (RDBMS) với các bảng chính:

| Bảng (Table) | Mô tả (Description) |
| :--- | :--- |
| **`users`** | [cite_start]Lưu thông tin người dùng, mật khẩu, role, trạng thái[cite: 394]. |
| **`roles`** | [cite_start]Định nghĩa quyền hạn (Admin, User)[cite: 408]. |
| **`movies`** | [cite_start]Thông tin phim, poster, trailer, thời lượng, phân loại[cite: 413]. |
| **`theaters`** | [cite_start]Danh sách các rạp chiếu phim trong hệ thống[cite: 432]. |
| **`screens`** | [cite_start]Phòng chiếu thuộc rạp, chứa thông tin tổng số ghế[cite: 441]. |
| **`seats`** | [cite_start]Chi tiết từng ghế (Số ghế A1, A2...), loại ghế (VIP/Normal) thuộc phòng nào[cite: 466]. |
| **`showtimes`** | [cite_start]Lịch chiếu phim (Phim X chiếu rạp Y phòng Z lúc H giờ)[cite: 449]. |
| **`bookings`** | [cite_start]Đơn đặt vé, tổng tiền, người đặt[cite: 457]. |
| **`booking_seat`** | [cite_start]Chi tiết ghế của booking (Booking X đặt ghế A1, A2)[cite: 475]. |
| **`ticket_prices`** | [cite_start]Cấu hình giá vé linh hoạt[cite: 490]. |
| **`payments`** | [cite_start]Lịch sử giao dịch, trạng thái thanh toán, mã giao dịch[cite: 500]. |
| **`news`** | [cite_start]Tin tức, sự kiện khuyến mãi[cite: 482]. |

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

* **Frontend:** ReactJS, Redux Toolkit, Tailwind CSS.
* **Backend:** Node.js, Express.js (Mô phỏng bằng JSON Server trong giai đoạn Dev).
* **Database:** MongoDB / MySQL (Tùy chọn triển khai).
* **Libraries:**
    * `jose`: Xử lý JWT Authentication.
    * `recharts`: Vẽ biểu đồ báo cáo doanh thu.
    * `lucide-react`: Bộ icon giao diện.
    * `bcryptjs`: Mã hóa mật khẩu.

---

## ⚙️ Hướng dẫn Cài đặt (Installation)

### Yêu cầu tiên quyết
* Node.js (v14 trở lên)
* NPM hoặc Yarn

### Các bước cài đặt

1.  **Clone dự án:**
    ```bash
    git clone [https://github.com/your-username/movie-booking-system.git](https://github.com/your-username/movie-booking-system.git)
    cd movie-booking-system
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```

3.  **Cấu hình môi trường:**
    Tạo file `.env` và cấu hình các biến cần thiết (Ví dụ: API URL, JWT Secret).

4.  **Chạy Mock Server (Backend giả lập):**
    ```bash
    npm run server
    ```
    *(Đảm bảo JSON Server chạy ở cổng 5000)*

5.  **Khởi chạy ứng dụng (Frontend):**
    ```bash
    npm run dev
    ```

6.  **Truy cập:**
    Mở trình duyệt tại `http://localhost:5173`.

---

## 🔮 Roadmap & Phát triển tương lai

* [x] Đăng ký/Đăng nhập & Auth với JWT.
* [x] Quản lý Phim, Rạp, Suất chiếu (Admin).
* [x] Đặt vé & Chọn ghế Real-time.
* [ ] Tích hợp API thanh toán thực tế (Sandbox VNPAY/Momo).
* [ ] Gửi Email xác thực và Vé điện tử (SMTP).
* [ ] Ứng dụng di động (React Native).

---

## 🤝 Đóng góp (Contributing)

Mọi đóng góp đều được hoan nghênh. Vui lòng tạo Pull Request hoặc mở Issue để thảo luận về các thay đổi lớn.

---

**Project by Team OJT - PTIT**
