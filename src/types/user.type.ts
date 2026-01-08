export type UserStatus = "ACTIVE" | "BLOCKED";
export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string; // Chuỗi mã hóa
  avatar?: string; // Dấu ? thể hiện có thể null
  phone?: string;
  address?: string;
  status: UserStatus;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
