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

// types/payment.ts
export interface CreateQrRequest {
  orderId: string;
  amount: number;
  description: string;
}

export interface WebhookData {
  orderCode: number;
  amount: number;
  description: string;
  transactionDateTime: string;
  reference: string; // Mã tham chiếu từ ngân hàng
  signature: string; // Chữ ký để xác thực bảo mật
}