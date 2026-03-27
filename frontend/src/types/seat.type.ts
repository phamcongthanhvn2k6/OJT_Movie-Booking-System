export type SeatType = "STANDARD" | "VIP" | "SWEETBOX";

export interface Seat {
  id: string;
  screen_id?: string;
  seat_number: string; // Ví dụ: A1, B2
  is_variable: boolean;
  type: SeatType;
  created_at: Date;
  updated_at: Date;
}
