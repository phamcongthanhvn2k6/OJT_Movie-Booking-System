import axios from "axios";
import type { Movie } from "../types/movie.type";

// Lấy danh sách phim
export async function getAllMovies() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_LOCAL}/movies`);
    return response;
  } catch (err) {
    console.log(err);
  }
}

// Lấy chi tiết phim
export async function getMovieById(data: { id: string }) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_LOCAL}/movies/${data.id}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

// Tạo phim mới
export async function createMovie(
  data: Omit<Movie, "id" | "created_at" | "updated_at">
) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_LOCAL}/movies`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Cập nhật phim
export async function updateMovie(data: Movie) {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_LOCAL}/movies/${data.id}`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Xóa phim
export async function deleteMovie(id: string) {
  try {
    await axios.delete(`${import.meta.env.VITE_LOCAL}/movies/${id}`);
    return id;
  } catch (err) {
    console.log(err);
  }
}

const movieAPI = {
  getAll: getAllMovies,
  getById: getMovieById,
  create: createMovie,
  put: updateMovie,
  delete: deleteMovie,
};

export default movieAPI;
