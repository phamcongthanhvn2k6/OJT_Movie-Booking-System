import React from 'react';
import { format, addDays } from 'date-fns';
import { vi } from 'date-fns/locale'; // Cài đặt: npm install date-fns

interface DateSelectorProps {
  selectedDate: string;
  onChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onChange }) => {
  // Tạo mảng 14 ngày tiếp theo
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      dateObj: date,
      isoDate: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEEE', { locale: vi }).replace("Thứ ", "Thứ\n"), // Hack xuống dòng cho đẹp
      dayNum: format(date, 'dd/MM'),
    };
  });

  return (
    <div className="flex justify-center my-8">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide max-w-full px-4">
        {days.map((item, index) => {
            const isActive = selectedDate === item.isoDate;
            // Xử lý hiển thị "Hôm nay" cho phần tử đầu tiên
            const label = index === 0 ? "Hôm nay" : item.dayName;

            return (
            <button
                key={item.isoDate}
                onClick={() => onChange(item.isoDate)}
                className={`
                flex flex-col items-center justify-center min-w-22.5 h-17.5 rounded-lg border-2 transition-all duration-300
                ${isActive 
                    ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)] scale-105' 
                    : 'bg-transparent border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500'}
                `}
            >
                <span className="text-[10px] font-semibold uppercase leading-tight text-center mb-1 opacity-80">
                    {label}
                </span>
                <span className="text-lg font-bold tracking-wider">
                    {item.dayNum}
                </span>
            </button>
            );
        })}
        </div>
    </div>
  );
};

export default DateSelector;