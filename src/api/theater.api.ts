import axios from "axios";
import type { Theater } from "../types/theater.type";

export async function getAllTheaters() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_LOCAL}/theaters`);
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function getTheaterById(data: { id: string }) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_LOCAL}/theaters/${data.id}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function createTheater(
  data: Omit<Theater, "id" | "created_at" | "updated_at">
) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_LOCAL}/theaters`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateTheater(data: Theater) {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_LOCAL}/theaters/${data.id}`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteTheater(id: string) {
  try {
    await axios.delete(`${import.meta.env.VITE_LOCAL}/theaters/${id}`);
    return id;
  } catch (err) {
    console.log(err);
  }
}

const theaterAPI = {
  getAll: getAllTheaters,
  getById: getTheaterById,
  create: createTheater,
  put: updateTheater,
  delete: deleteTheater,
};

export default theaterAPI;
