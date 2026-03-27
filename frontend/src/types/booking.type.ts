export interface Booking {
  id: string;
  user_id: string;
  showtime_id: string;
  total_seat: number;
  total_price_movie: number;
  created_at: Date;
}
