import axios from "axios";
import type { TicketPrice } from "../types/ticketPrice.type";

const BASE_URL = import.meta.env.VITE_LOCAL; // http://localhost:5000

export const ticketPriceAPI = {
  getAll: async () => axios.get<TicketPrice[]>(`${BASE_URL}/ticket_prices`),
  create: async (data: Omit<TicketPrice, "id">) =>
    axios.post(`${BASE_URL}/ticket_prices`, data),
  update: async (data: TicketPrice) =>
    axios.put(`${BASE_URL}/ticket_prices/${data.id}`, data),
  delete: async (id: string) => axios.delete(`${BASE_URL}/ticket_prices/${id}`),
};
