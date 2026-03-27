import axios, { type AxiosResponse } from "axios";
import type { Seat } from "../types/seat.type";

// Lấy danh sách ghế theo suất chiếu
export async function getSeatsByScreenId(
  screenId: string
): Promise<AxiosResponse<Seat[]>> {
  return axios.get<Seat[]>(
    `${import.meta.env.VITE_LOCAL}/seats?screen_id=${screenId}`
  );
}

// Lấy chi tiết ghế theo id
export async function getSeatById(
  seatId: string
): Promise<AxiosResponse<Seat>> {
  return axios.get<Seat>(`${import.meta.env.VITE_LOCAL}/seats?id=${seatId}`);
}

// Tạo ghế mới
export async function createSeat(data: Omit<Seat, "id"> | Seat) {
  // json-server sẽ tự động generate ID, không cần truyền id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seatData: any = {
    screen_id: data.screen_id,
    seat_number: data.seat_number,
    type: data.type,
    is_variable: data.is_variable ?? true,
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || new Date(),
  };
  // Không truyền id để json-server tự generate
  return axios.post(`${import.meta.env.VITE_LOCAL}/seats`, seatData);
}

// Cập nhật ghế
export async function updateSeat(data: Seat) {
  return axios.put(`${import.meta.env.VITE_LOCAL}/seats/${data.id}`, {
    ...data,
    id: data.id,
    screen_id: data.screen_id,
    seat_number: data.seat_number,
    type: data.type,
    is_variable: data.is_variable,
    created_at: data.created_at,
    updated_at: new Date(),
  });
}

// Xóa ghế
export async function deleteSeat(id: string) {
  await axios.delete(`${import.meta.env.VITE_LOCAL}/seats/${id}`);
  return id;
}

const seatAPI = {
  getSeatsByScreenId,
  getById: getSeatById,
  create: createSeat,
  update: updateSeat,
  delete: deleteSeat,
};

export default seatAPI;
