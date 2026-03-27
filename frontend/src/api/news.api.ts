// src/api/news.api.ts
import axios from "axios";
// Bây giờ file import này sẽ không còn lỗi nữa vì ta đã export interface News
import type { News } from "../types/news.types"; 

// Lấy biến môi trường (Lưu ý: Bạn phải chắc chắn trong file .env có biến VITE_LOCAL)
const API_URL = import.meta.env.VITE_LOCAL;

export async function getAllNews() {
  try {
    // Thêm <News[]> để báo cho TS biết API trả về mảng News
    const response = await axios.get<News[]>(`${API_URL}/news`);
    return response;
  } catch (err) {
    console.log(err);
    throw err; // Nên throw lỗi để component bên ngoài biết mà xử lý
  }
}

export async function getNewsById(data: { id: string }) {
  try {
    const response = await axios.get<News>(
      `${API_URL}/news/${data.id}`
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Logic Omit này bây giờ sẽ hoạt động tốt vì interface News đã có created_at và updated_at
export async function createNews(
  data: Omit<News, "id" | "created_at" | "updated_at">
) {
  try {
    const response = await axios.post<News>(
      `${API_URL}/news`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateNews(data: News) {
  try {
    const response = await axios.put<News>(
      `${API_URL}/news/${data.id}`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteNews(id: string) {
  try {
    await axios.delete(`${API_URL}/news/${id}`);
    return id;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const newsAPI = {
  getAll: getAllNews,
  getById: getNewsById,
  create: createNews,
  put: updateNews,
  delete: deleteNews,
};

export default newsAPI;