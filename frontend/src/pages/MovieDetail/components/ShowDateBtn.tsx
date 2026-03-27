import React from "react";
import type { Showtime } from "../../../types/showtime.type";

interface ShowDateBtnProps {
  showtime: Showtime;
  isSelected: boolean;
  onClick: () => void;
}

export const ShowDateBtn: React.FC<ShowDateBtnProps> = ({
  showtime,
  isSelected,
  onClick,
}) => {
  // Chuyển string sang Date
  const date = new Date(showtime.start_time);

  // 1. Xử lý hiển thị Thứ (Full text như hình)
  const daysFull = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const dayName = daysFull[date.getDay()];

  // 2. Xử lý Ngày và Tháng
  const dayNumber = date.getDate();
  const monthNumber = date.getMonth() + 1;

  return (
    <button
      onClick={onClick}
      // h-full: Cao full thẻ cha
      // w-[90px]: Độ rộng cố định
      // rounded-none: Bỏ bo tròn để thành ô vuông sắc cạnh
      className={`
        h-full w-[90px] flex flex-col items-center justify-center 
        flex-shrink-0 cursor-pointer transition-all duration-200
        font-[Montserrat] border-r border-[#1A1D23] last:border-r-0
        rounded-none px-2 py-3
        ${
          isSelected
            ? "bg-red-600 text-white" // Active: Nền đỏ, chữ trắng
            : "bg-[#1A1D23] text-gray-400 hover:bg-gray-800 hover:text-white" // Inactive: Nền tối
        }
      `}
    >
      {/* Dòng 1: Tháng (Th. 11) */}
      <span className="text-[12px] font-medium opacity-80 mb-1">
        Th. {monthNumber}
      </span>

      {/* Dòng 2: Ngày số (13) - To và Đậm */}
      <span className="text-3xl font-bold leading-none mb-1">{dayNumber}</span>

      {/* Dòng 3: Thứ (Thứ tư) */}
      <span className="text-[12px] font-medium opacity-90">{dayName}</span>
    </button>
  );
};
