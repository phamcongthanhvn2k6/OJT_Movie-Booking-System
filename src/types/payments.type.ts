export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type PaymentMethod = "VNPAY" | "PAYPAL" | "MOMO" | "CASH"; // Có thể mở rộng

export interface Payment {
  id: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_time?: Date;
  amount: number;
  transaction_id?: string;

  booking_id?: string;
}
