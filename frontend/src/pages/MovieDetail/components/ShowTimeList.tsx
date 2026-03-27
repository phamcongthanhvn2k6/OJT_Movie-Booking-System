import { useState, useMemo } from "react";
import type { Showtime } from "../../../types/showtime.type";
import { ShowDateBtn } from "./ShowDateBtn";

interface ShowtimeListProps {
  showtimes: Showtime[];
  selectedShowtime?: Showtime | null;
  onSelectShowtime?: (showtime: Showtime) => void;
}

export const ShowTimeList = ({
  showtimes,
  selectedShowtime,
  onSelectShowtime,
}: ShowtimeListProps) => {
  // State chỉ lưu ngày được user BẤM CHỌN thủ công
  const [manualSelectedDate, setManualSelectedDate] = useState<Date | null>(null);

  // Helper: Chuyển đổi an toàn
  const toDate = (dateInput: string | Date) => new Date(dateInput);

  const isSameDay = (a: Date, b: Date) =>
  a.getUTCFullYear() === b.getUTCFullYear() &&
  a.getUTCMonth() === b.getUTCMonth() &&
  a.getUTCDate() === b.getUTCDate();

  // 1. Lọc danh sách Ngày duy nhất
  const uniqueShowtimesByDate = useMemo(() => {
    return showtimes
      .filter((showtime, index, self) =>
        index === self.findIndex((s) => 
          isSameDay(toDate(s.start_time), toDate(showtime.start_time))
        )
      )
      .sort((a, b) => toDate(a.start_time).getTime() - toDate(b.start_time).getTime());
  }, [showtimes]);

  // --- FIX LỖI ESLINT: Tính toán ngày đang hiển thị ngay lập tức ---
  // Nếu user chưa chọn (manualSelectedDate === null) -> Lấy ngày đầu tiên trong list
  // Nếu list rỗng -> null
  const activeDate = useMemo(() => {
    if (manualSelectedDate) return manualSelectedDate;
    if (uniqueShowtimesByDate.length > 0) return toDate(uniqueShowtimesByDate[0].start_time);
    return null;
  }, [manualSelectedDate, uniqueShowtimesByDate]);

  // Helper: Format giờ (HH:mm)
  const getTimeKey = (date: Date) =>
  `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  // 2. Lọc danh sách Giờ theo activeDate
  const uniqueShowtimesByTime = useMemo(() => {
    if (!activeDate) return [];

    return Array.from(
      new Map(
        showtimes
          .filter((s) => isSameDay(toDate(s.start_time), activeDate))
          .map((s) => [getTimeKey(toDate(s.start_time)), s])
      ).values()
    ).sort((a, b) => toDate(a.start_time).getTime() - toDate(b.start_time).getTime());
  }, [showtimes, activeDate]);
  

  return (
    <>
      {/* DANH SÁCH NGÀY CHIẾU */}
      <div className=" flex overflow-x-auto bg-[#1A1D23] items-center justify-center md:justify-center px-2 scrollbar-hide">
        {uniqueShowtimesByDate.map((showtime) => {
          const showtimeDate = toDate(showtime.start_time);
          return (
            <ShowDateBtn
              key={showtimeDate.getTime()}
              showtime={showtime}
              // So sánh với activeDate đã tính toán
              isSelected={activeDate ? isSameDay(activeDate, showtimeDate) : false}
              onClick={() => setManualSelectedDate(showtimeDate)} 
            />
          );
        })}
      </div>

        <div className="w-full lg:max-w-4xl md:max-w-180 max-w-89.5 mx-auto px-4 pb-12">
      <p className="w-full text-left text-[#F97316] my-3 font-semibold text-[13px] md:text-[14px] leading-5 px-4 md:px-0">
        Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và
        Khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc trước 23h.
      </p>

      {/* DANH SÁCH GIỜ CHIẾU */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4 mx-0 md:mx-4">
        {uniqueShowtimesByTime.length > 0 ? (
          uniqueShowtimesByTime.map((showtime) => {
            const timeStr = getTimeKey(toDate(showtime.start_time));
            return (
              <button
                type="button"
                key={showtime.id}
                onClick={() => onSelectShowtime?.(showtime)}
                className={`px-4 py-2.5 rounded-full border font-bold text-sm transition-all duration-200 hover:cursor-pointer
                  ${
                    selectedShowtime?.id === showtime.id
                      ? "bg-gray-700 border-gray-700 text-white shadow-lg"
                      : "bg-gray-900 border-gray-700 text-gray-300 hover:border-red-500 hover:text-white"
                  }`}
              >
                {timeStr}
              </button>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 py-4 italic">
            Không có suất chiếu nào cho ngày này.
          </div>
        )}
        </div>
      </div>
    </>
  );
};