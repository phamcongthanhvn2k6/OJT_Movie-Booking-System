import { useEffect, useState } from "react";
import type { Booking } from "../../../types/booking.type";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import bookingAPI from "../../../api/booking.api";
import movieAPI from "../../../api/movie.api";
import type { Movie } from "../../../types/movie.type";
import type { Showtime } from "../../../types/showtime.type";
import showtimeAPI from "../../../api/showtime.api";
import seatAPI from "../../../api/seat.api";
import type { Seat } from "../../../types/seat.type";
import axios from "axios";
import type { Payment } from "../../../types/payments.type";

const PaymentMain = () => {
  const location = useLocation();
  const { selectedSeats = [], seatList = [] } = location.state || {};

  const { movieId, bookingId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user_data") || "null");
  const [booking, setBooking] = useState<Booking>();
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [payment, setPayment] = useState<Payment | null>(null);

  // fetch Booking
  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        // bookingId là string → truyền thẳng
        const res = await bookingAPI.getById(bookingId);

        if (!res || !res.data) {
          console.error("Không tìm thấy booking");
          return;
        }

        setBooking(res.data);
      } catch (err) {
        console.error("Lỗi fetch booking", err);
      }
    };

    fetchBooking();
  }, [bookingId]);

  // fetch current movie
  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        // movieId là string → truyền thẳng
        const res = await movieAPI.getById({ id: movieId });

        if (!res || !res.data) {
          console.error("Không tìm thấy movie");
          return;
        }

        setCurrentMovie(res.data);
      } catch (err) {
        console.error("Lỗi fetch movie", err);
      }
    };

    fetchMovie();
  }, [movieId]);

  //fetch Showtime
  useEffect(() => {
    if (!booking?.showtime_id) return;

    const fetchShowtime = async () => {
      try {
        const res = await showtimeAPI.getById({
          id: booking.showtime_id,
        });

        if (!res?.data) {
          console.error("Không tìm thấy showtime");
          return;
        }

        setShowtime(res.data);
      } catch (err) {
        console.error("Lỗi fetch showtime", err);
      }
    };

    fetchShowtime();
  }, [booking]);

  //tạo payment
  useEffect(() => {
    if (!booking?.id) return;

    const initPayment = async () => {
      try {
        //kiểm tra payment đã tồn tại chưa
        const existed = await axios.get(
          `${import.meta.env.VITE_LOCAL}/payments?booking_id=${booking.id}`
        );

        if (existed.data.length > 0) {
          setPayment(existed.data[0]);
          return;
        }

        //chưa có thì tạo mới
        const res = await axios.post(`${import.meta.env.VITE_LOCAL}/payments`, {
          booking_id: booking.id,
          payment_method: "CASH",
          payment_status: "PENDING",
          amount: booking.total_price_movie,
          created_at: new Date(),
          updated_at: new Date(),
        });

        setPayment(res.data);
      } catch (err) {
        console.error("Init payment error", err);
      }
    };

    initPayment();
  }, [booking?.id]);

  console.log("payment", payment);

  //handle payment
  const handlePayment = async () => {
    if(!user){
      alert("vui lòng đăng nhập")
      navigate("/login")
      return;
    } 

    if (!payment) {
      alert("Payment chưa được khởi tạo");
      return;
    }

    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (!booking || selectedSeats.length === 0) {
      alert("Dữ liệu không hợp lệ");
      return;
    }

    try {
      //Update payment → COMPLETED
      await axios.patch(
        `${import.meta.env.VITE_LOCAL}/payments/${payment?.id}`,
        {
          payment_method: selectedMethod,
          payment_status: "COMPLETED",
          payment_time: new Date(),
          updated_at: new Date(),
        }
      );

      //Tạo booking_seats
      await Promise.all(
        selectedSeats.map((seat: Seat) =>
          axios.post(`${import.meta.env.VITE_LOCAL}/booking_seats`, {
            booking_id: booking.id,
            seat_id: seat.id,
            quantity: 1,
            created_at: new Date(),
            updated_at: new Date(),
          })
        )
      );
      alert("Thanh toán thành công");
      navigate("/payment-success");
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Thanh toán thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] py-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 px-4">
        {/* LEFT */}
        <div className="flex flex-col gap-6">
          {/* Thông tin phim */}
          <div className="bg-[#151A21] rounded-[16px] p-6 text-white">
            <p className="font-semibold mb-4">Thông tin phim</p>

            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Phim</p>
                <p className="font-medium">{currentMovie?.title}</p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Ghế</p>
                <p className="font-medium">
                  {selectedSeats.map((s: Seat) => s.seat_number).join(", ")}
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Ngày giờ chiếu</p>
                <p className="font-medium text-[#F97316]">
                  {/*giờ chiếu */}
                  {showtime?.start_time
                    ? new Date(showtime.start_time).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "UTC",
                        }
                      )
                    : ""}
                  <span> - </span>
                  {/*ngày chiếu */}
                  <span className="text-white">
                    {showtime?.start_time
                      ? `${new Date(showtime.start_time).getDate()}/${
                          new Date(showtime.start_time).getMonth() + 1
                        }/${new Date(showtime.start_time).getFullYear()}`
                      : ""}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Phòng chiếu</p>
                <p className="font-medium">{showtime?.screen_id}</p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Định dạng</p>
                <p className="font-medium">{currentMovie?.type}</p>
              </div>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="bg-[#151A21] rounded-[16px] p-6 text-white">
            <p className="font-semibold mb-4">Thông tin thanh toán</p>

            <div className="border border-[#2A2F3A] rounded-[12px] overflow-hidden text-sm">
              <div className="grid grid-cols-[2fr_1fr_1fr] px-4 py-3 text-gray-400 border-b border-[#2A2F3A]">
                <p>Danh mục</p>
                <p className="text-center">Số lượng</p>
                <p className="text-right">Tổng tiền</p>
              </div>

              <div className="grid grid-cols-[2fr_1fr_1fr] px-4 py-4">
                <p>
                  Ghế (
                  {selectedSeats.map((s: Seat) => s.seat_number).join(", ")})
                </p>
                <p className="text-center">{booking?.total_seat}</p>
                <p className="text-right font-semibold">
                  {booking?.total_price_movie}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-[#151A21] rounded-[16px] p-6 text-white flex flex-col">
          <p className="font-semibold mb-4">Phương thức thanh toán</p>

          <div className="flex flex-col gap-3 mb-6">
            {[
              {
                name: "VietQR",
                icon: "/public/vietqr.png",
                color: "border-[#2A2F3A]",
              },
              {
                name: "VNPAY",
                icon: "/public/vnpay.png",
                color: "border-[#2A2F3A]",
              },
              {
                name: "Viettel Money",
                icon: "/public/viettelmoney.png",
                color: "border-[#2A2F3A]",
              },
              {
                name: "Payoo",
                icon: "/public/payoo.png",
                color: "border-[#2A2F3A]",
              },
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedMethod(item.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[12px] border cursor-pointer 
        ${item.color} ${
                  selectedMethod === item.name
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                {/* radio */}
                <div
                  className={`w-4 h-4 rounded-full border border-current 
          ${selectedMethod === item.name ? "bg-red-500" : ""}`}
                />

                {/* icon + text */}
                <p className="font-medium flex items-center gap-2">
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-[60px] h-[18px] lg:w-[64px] lg:h-[21px]  object-contain"
                  />
                  {item.name}
                </p>
              </div>
            ))}
          </div>

          {/* Chi phí */}
          <div className="text-sm mb-6">
            <p className="font-semibold mb-3">Chi phí</p>

            <div className="flex justify-between mb-2">
              <span>Thanh toán</span>
              <span>{booking?.total_price_movie}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Phí</span>
              <span>0đ</span>
            </div>

            <div className="flex justify-between font-semibold">
              <span>Tổng cộng</span>
              <span>{booking?.total_price_movie}</span>
            </div>
          </div>

          {/* Button */}
          <button
            className="w-full py-[12px] rounded-[9999px] bg-gradient-to-r from-[#E30713] to-[#FE6969] font-semibold mb-3 hover:cursor-pointer"
            onClick={handlePayment}
          >
            Thanh toán
          </button>

          <button className="w-full py-[10px] rounded-[9999px] border border-white text-white mb-4 hover:cursor-pointer">
            Quay lại
          </button>

          <p className="text-[12px] text-[#F97316] text-center leading-4">
            Lưu ý: Không mua vé cho trẻ em dưới 13 tuổi đối với các suất chiếu
            phim kết thúc sau 23h00.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMain;
