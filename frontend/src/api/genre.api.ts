import axios from "axios";
import type { Genre } from "../types/genres.type";

// Lấy danh sách thể loại
export async function getAllGenres() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_LOCAL}/genres`);
    return response;
  } catch (err) {
    console.log("Lỗi lấy danh sách thể loại:", err);
  }
}

// Lấy chi tiết thể loại
export async function getGenreById(data: { id: string }) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_LOCAL}/genres/${data.id}`
    );
    return response;
  } catch (err) {
    console.log("Lỗi lấy chi tiết thể loại:", err);
  }
}

// Tạo thể loại mới
export async function createGenre(data: Omit<Genre, "id">) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_LOCAL}/genres`,
      data
    );
    return response;
  } catch (err) {
    console.log("Lỗi tạo thể loại:", err);
    throw err; // Ném lỗi để Thunk bắt được (nếu cần xử lý chi tiết)
  }
}

// Cập nhật thể loại
export async function updateGenre(data: Genre) {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_LOCAL}/genres/${data.id}`,
      data
    );
    return response;
  } catch (err) {
    console.log("Lỗi cập nhật thể loại:", err);
    throw err;
  }
}

// Xóa thể loại
export async function deleteGenre(id: string) {
  try {
    await axios.delete(`${import.meta.env.VITE_LOCAL}/genres/${id}`);
    return id;
  } catch (err) {
    console.log("Lỗi xóa thể loại:", err);
  }
}

const genreAPI = {
  getAll: getAllGenres,
  getById: getGenreById,
  create: createGenre,
  put: updateGenre,
  delete: deleteGenre,
};

export default genreAPI;
