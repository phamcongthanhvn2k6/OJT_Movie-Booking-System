/* eslint-disable @typescript-eslint/no-unused-vars */
import { format, addDays, parseISO, isSameDay } from "date-fns";
// Cài đặt: npm install date-fns

export const generateDateTabs = (days = 7) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = addDays(today, i);
    dates.push({
      fullDate: date, // Object Date để so sánh
      isoDate: format(date, "yyyy-MM-dd"),
      dayName: i === 0 ? "Hôm nay" : format(date, "dd/MM"),
      dayOfWeek: i === 0 ? format(date, "dd/MM") : getDayOfWeek(date), // Hàm tự viết hoặc dùng format 'EEEE'
    });
  }
  return dates;
};

// Helper chuyển đổi thứ sang tiếng Việt
const getDayOfWeek = (date: Date) => {
  const days = [
    "Chủ Nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  return days[date.getDay()];
};

// Format giờ từ ISO string: "2024-10-24T14:00:00.000Z" -> "14:00"
export const formatTime = (isoString: string) => {
  return format(parseISO(isoString), "HH:mm");
};
