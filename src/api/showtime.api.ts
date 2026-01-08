import axios from "axios";
import type { Showtime } from "../types/showtime.type";

// Lấy danh sách suất chiếu
export async function getAllShowtimes(params?: {
  movieId?: string;
  date?: string;
}) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_LOCAL}/showtimes`,
      {
        params,
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function getShowtimeById(data: { id: string }) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_LOCAL}/showtimes/${data.id}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function createShowtime(
  data: Omit<Showtime, "id" | "created_at" | "updated_at">
) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_LOCAL}/showtimes`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateShowtime(data: Showtime) {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_LOCAL}/showtimes/${data.id}`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteShowtime(id: string) {
  try {
    await axios.delete(`${import.meta.env.VITE_LOCAL}/showtimes/${id}`);
    return id;
  } catch (err) {
    console.log(err);
  }
}

const showtimeAPI = {
  getAll: getAllShowtimes,
  getById: getShowtimeById,
  create: createShowtime,
  put: updateShowtime,
  delete: deleteShowtime,
};

export default showtimeAPI;
