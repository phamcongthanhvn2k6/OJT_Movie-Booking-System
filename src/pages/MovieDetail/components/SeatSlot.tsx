type SeatType = "STANDARD" | "VIP" | "SWEETBOX";

interface SeatProps {
  seat: {
    seat_number: string;
    type: SeatType;
    status: boolean; // false = đã đặt
    isSelected?: boolean; // ghế bạn chọn
  };
  onSelect?: () => void;
}

const SeatSlot = ({ seat, onSelect }: SeatProps) => {
  const getSeatClass = () => {
    // 1️⃣ Đã đặt
    if (!seat.status) {
      return "bg-[#2F343B] cursor-not-allowed opacity-60";
    }

    // 2️⃣ Ghế bạn chọn
    if (seat.isSelected) {
      return "bg-blue-500";
    }

    // 3️⃣ Theo loại ghế
    switch (seat.type) {
      case "VIP":
        return "bg-orange-500";
      case "SWEETBOX":
        return "bg-red-500";
      default:
        return "bg-[#252A31]";
    }
  };

  return (
    <div
      onClick={() => {
        if (seat.status) onSelect?.();
      }}
      className={`
        flex items-center justify-center
        lg:w-[40px] lg:h-[40px]
        md:w-[25px] md:h-[25px]
        w-[16px] h-[16px]
        rounded-[4px]
        text-white text-xs
        transition-colors
        hover:cursor-pointer
        ${getSeatClass()}
      `}
    >
      <span className="lg:block hidden">{!seat.status ? "X" : seat.seat_number}</span>
    </div>
  );
};

export default SeatSlot;
