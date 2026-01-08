export type SeatType = "STANDARD" | "VIP" | "SWEETBOX";
export type MovieType = "2D" | "3D";
export type DayType = 0 | 1; // 0: Ngày thường, 1: Cuối tuần/Lễ

export interface TicketPrice {
  id: string;
  type_seat: SeatType;
  type_movie: MovieType;
  price: number;
  day_type: DayType;
  start_time: Date; // Thời gian bắt đầu áp dụng giá (type Date linh hoạt trong khung giờ và ngày)
  end_time: Date;
}
