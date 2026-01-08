import { useEffect, useState } from "react";
import type { Seat } from "../../../types/seat.type";
import type { Showtime } from "../../../types/showtime.type";
import type { Booking } from "../../../types/booking.type";
import SeatSlot from "./SeatSlot";
import { useParams } from "react-router-dom";
import bookingAPI from "../../../api/booking.api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import seatAPI from "../../../api/seat.api";
import axios from "axios";
import type { BookingSeat } from "../../../types/bookingSeat.type";
import { ticketPriceAPI } from "../../../api/ticketPrice.api";
import { toDate } from "date-fns";
import type { DayType, TicketPrice } from "../../../types/ticketPrice.type";
import type { Movie } from "../../../types/movie.type";
import movieAPI from "../../../api/movie.api";

interface BookingProps {
  showtime: Showtime;
}

const BookingPage = ({ showtime }: BookingProps) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [seatList, setSeatList] = useState<Seat[]>([]);
  const [bookedSeatIds, setBookedSeatIds] = useState<string[]>([]);
  const [selectSeatTime] = useState<Date>(() => new Date());
  const [ticketPrices, setTicketPrices] = useState<TicketPrice[]>([]);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const { id } = useParams();
  const nav = useNavigate();

  // fetch current movie
  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        // movieId là string → truyền thẳng
        const res = await movieAPI.getById({ id: id });

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
  }, [id]);

  //danh sách BookingSeat theo showtime
  useEffect(() => {
    if (!showtime?.id) return;

    const fetchBookedSeats = async () => {
      try {
        // 1. Lấy booking theo showtime
        const bookingRes = await axios.get(
          `${import.meta.env.VITE_LOCAL}/bookings?showtime_id=${showtime.id}`
        );

        console.log("showtime.id", showtime.id);

        console.log("bookingRes.data", bookingRes.data);

        const bookings = bookingRes.data;
        if (!Array.isArray(bookings) || bookings.length === 0) {
          setBookedSeatIds([]);
          return;
        }

        const bookingIds = bookings.map((b: any) => b.id);
        console.log("bookedSeatIds", bookedSeatIds);

        // 2. Lấy booking_seat theo booking_id
        const bookingSeatRes = await axios.get(
          `${
            import.meta.env.VITE_LOCAL
          }/booking_seats?booking_id=${bookingIds.join("&booking_id=")}`
        );

        const bookingSeats = bookingSeatRes.data;

        console.log("bookingSeats", bookingSeats);

        // 3. Lấy seat_id đã đặt
        const seatIds = bookingSeats.map((bs: any) => bs.seat_id);
        setBookedSeatIds(seatIds);
      } catch (err) {
        console.error("Lỗi lấy booking seat:", err);
        setBookedSeatIds([]);
      }
    };

    fetchBookedSeats();
  }, [showtime.id]);

  // Lấy danh sách ghế từ API
  useEffect(() => {
    if (!showtime?.screen_id) return;

    const fetchSeats = async () => {
      try {
        const res = await seatAPI.getSeatsByScreenId(
          showtime.screen_id as string
        );

        if (Array.isArray(res.data)) {
          setSeatList(res.data);
        } else {
          setSeatList([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ghế:", error);
        setSeatList([]);
      }
    };

    fetchSeats();
  }, [showtime.screen_id]);

  const handleCreateBooking = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt vé");
      nav("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế");
      return;
    }
    const data: Booking = {
      id: Date.now().toString(),
      user_id: user.id,
      showtime_id: showtime.id,
      total_seat: selectedSeats.length,
      total_price_movie: totalPrice,
      created_at: new Date(),
    };
    try {
      const res = await bookingAPI.create(data);
      const createdBooking = res.data;
      console.log("Tạo booking thành công:", createdBooking);
      nav(`/payment/${id}/${data.id}`, {
        state: { selectedSeats, seatList },
      });
    } catch (error) {
      console.error("Lỗi khi tạo booking:", error);
    }
  };

  //fetch ticketPrice
  useEffect(() => {
    const fetchTicketPrices = async () => {
      try {
        const res = await ticketPriceAPI.getAll();
        setTicketPrices(res.data);
      } catch (err) {
        console.error("Lỗi lấy ticket prices", err);
        setTicketPrices([]);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchTicketPrices();
  }, []);

  //hàm tính tiền
  const calculatedTotalPrice = (
    seats: Seat[],
    showtimeDate: Date,
    movieType: "2D" | "3D",
    ticketPrices: TicketPrice[]
  ): number => {
    if (!seats.length) return 0;

    // 0 = ngày thường, 1 = cuối tuần / lễ
    const dayType: DayType =
      showtimeDate.getDay() === 0 || showtimeDate.getDay() === 6 ? 1 : 0;

    return seats.reduce((total, seat) => {
      if (!seat.is_variable) return total;

      const price = ticketPrices.find(
        (tp) =>
          tp.type_seat === seat.type &&
          tp.type_movie === movieType &&
          tp.day_type === dayType &&
          new Date(tp.start_time) <= showtimeDate &&
          showtimeDate <= new Date(tp.end_time)
      );

      return price ? total + price.price : total;
    }, 0);
  };

  const totalPrice =
    currentMovie && currentMovie.type
      ? calculatedTotalPrice(
          selectedSeats,
          toDate(showtime.start_time),
          currentMovie.type,
          ticketPrices
        )
      : 0;

  const toggleSeat = (seat: Seat) => {
    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  //  Nhóm ghế theo hàng
  const groupedSeats = seatList.reduce((acc, seat) => {
    const row = seat.seat_number[0]; // A, B, C…
    const key = `${seat.screen_id}-${row}`; // phân biệt theo phòng chiếu + hàng

    if (!acc[key]) acc[key] = [];
    acc[key].push(seat);

    return acc;
  }, {} as Record<string, Seat[]>);

  // Helper: Format giờ (HH:mm)
  const getTimeKey = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  return (
    <div className="mt-8">
      <div className="w-full flex items-center justify-between">
        <p className="font-bold text-[14px] leading-5">
          Giờ chiếu: {getTimeKey(toDate(showtime.start_time))}
        </p>
        <p className="border border-[#EF4444] text-white py-[8px] px-[16px] rounded-[12px]">
          Thời gian chọn ghế: {getTimeKey(selectSeatTime)}
        </p>
      </div>

      <img src="/screen.png" alt="" className="w-full mt-[16px]" />

      <p className="text-center font-bold leading-5 text-[20px] mb-6">
        Phòng chiếu số {showtime.screen_id}
      </p>

      {/* Sơ đồ vị trí */}
      <div className="flex flex-col items-center lg:gap-4 gap-1">
        {Object.keys(groupedSeats)
          .sort()
          .map((rowKey) => {
            const sortedSeats = [...groupedSeats[rowKey]].sort(
              (a, b) =>
                parseInt(a.seat_number.slice(1)) -
                parseInt(b.seat_number.slice(1))
            );

            const rowLabel = rowKey.split("-")[1]; // chỉ lấy A, B, C...

            return (
              <div
                key={rowKey}
                className="w-full max-w-[712px] grid lg:gap-4 gap-1 grid-cols-[32px_repeat(15,minmax(0,1fr))_32px] lg:grid-cols-[repeat(15,minmax(0,1fr))]"
              >
                {/* Tên hàng – trái */}
                <div className="flex lg:hidden items-center justify-center text-white font-semibold">
                  {rowLabel}
                </div>

                {sortedSeats.map((seat) => {
                  const isDisabled =
                    !seat.is_variable || bookedSeatIds.includes(seat.id);

                  return (
                    <SeatSlot
                      key={seat.id}
                      seat={{
                        seat_number: seat.seat_number,
                        type: seat.type,
                        status: !isDisabled, // true = còn chọn được
                        isSelected: selectedSeats.some((s) => s.id === seat.id),
                      }}
                      onSelect={() => {
                        if (isDisabled) return;
                        toggleSeat(seat);
                      }}
                    />
                  );
                })}

                {/* Tên hàng – phải */}
                <div className="flex lg:hidden items-center justify-center text-white font-semibold">
                  {rowLabel}
                </div>
              </div>
            );
          })}
      </div>

      {/* Chú thích */}
      <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-[Montserrat] font-normal">
        {/* Ghế đã đặt */}
        <div className="flex items-center gap-2">
          <div
            className="lg:w-[40px] lg:h-[40px]
        md:w-[25px] md:h-[25px]
        w-[16px] h-[16px] bg-[#252A31] flex items-center justify-center text-white rounded-[4px]"
          >
            X
          </div>
          <span>Đã đặt</span>
        </div>

        {/* Ghế bạn chọn */}
        <div className="flex items-center gap-2">
          <div
            className="lg:w-[40px] lg:h-[40px]
        md:w-[25px] md:h-[25px]
        w-[16px] h-[16px] bg-blue-500 rounded-[4px]"
          ></div>
          <span>Ghế bạn chọn</span>
        </div>

        {/* Ghế thường */}
        <div className="flex items-center gap-2">
          <div
            className="lg:w-[40px] lg:h-[40px]
                      md:w-[25px] md:h-[25px]
                      w-[16px] h-[16px] bg-[#252A31] rounded-[4px]"
          ></div>
          <span>Ghế thường</span>
        </div>

        {/* Ghế VIP */}
        <div className="flex items-center gap-2">
          <div
            className="lg:w-[40px] lg:h-[40px]
                        md:w-[25px] md:h-[25px]
                        w-[16px] h-[16px] bg-orange-500 rounded-[4px]"
          ></div>
          <span>Ghế VIP</span>
        </div>

        {/* Ghế đôi */}
        <div className="flex items-center gap-2">
          <div
            className="lg:w-[40px] lg:h-[40px]
                        md:w-[25px] md:h-[25px]
                        w-[16px] h-[16px] bg-red-500 rounded-[4px]"
          ></div>
          <span>Ghế đôi</span>
        </div>
      </div>

      {/* Thông tin ghế đã chọn và thanh toán */}
      <div className="mt-8 w-full max-w-[712px] mx-auto font-montserrat text-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Text */}
          <div className="flex flex-col text-[16px] items-start text-left">
            <p>
              Ghế đã chọn: {selectedSeats.map((s) => s.seat_number).join(", ")}
            </p>
            <p className="mt-1">
              Tổng tiền:{" "}
              <span className="font-bold">{totalPrice}đ</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full md:w-auto gap-3">
            <button
              className="
          flex-1 md:flex-none
          py-[10px] px-[33px]
          rounded-[9999px]
          border border-white text-white
          hover:bg-gray-100 hover:text-gray-900 transition
          hover: cursor-pointer hover:scale-105 hover:shadow-lg
        "
            >
              Quay lại
            </button>

            <button
              className="
                          flex-1 md:flex-none
                          py-[10px] px-[32px]
                          rounded-[9999px]
                          bg-gradient-to-r from-[#E30713] to-[#FE6969]
                          text-white
                          transition duration-300 ease-out
                          transform
                          hover:scale-105 hover:shadow-lg hover:from-[#FE6969] hover:to-[#E30713]
                          cursor-pointer
                        "
              onClick={handleCreateBooking}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
