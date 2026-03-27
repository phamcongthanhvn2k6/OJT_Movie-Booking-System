import axios from "axios";
import type { Booking } from "../types/booking.type";

export async function getAllBookings() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_LOCAL}/bookings`);
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function getBookingById(id: string) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_LOCAL}/bookings/${id}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

// Tạo booking mới
export async function createBooking(data: Booking) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_LOCAL}/bookings`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateBooking(data: Booking) {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_LOCAL}/bookings/${data.id}`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteBooking(id: string) {
  try {
    await axios.delete(`${import.meta.env.VITE_LOCAL}/bookings/${id}`);
    return id;
  } catch (err) {
    console.log(err);
  }
}

const bookingAPI = {
  getAll: getAllBookings,
  getById: getBookingById,
  create: createBooking,
  put: updateBooking,
  delete: deleteBooking,
};

export default bookingAPI;
