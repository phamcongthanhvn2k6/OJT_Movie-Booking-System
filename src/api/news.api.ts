import axios from "axios";
import type { News } from "../types/news.types";

export async function getAllNews() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_LOCAL}/news`);
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function getNewsById(data: { id: string }) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_LOCAL}/news/${data.id}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function createNews(
  data: Omit<News, "id" | "created_at" | "updated_at">
) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_LOCAL}/news`,
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
    const response = await axios.put(
      `${import.meta.env.VITE_LOCAL}/news/${data.id}`,
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
    await axios.delete(`${import.meta.env.VITE_LOCAL}/news/${id}`);
    return id;
  } catch (err) {
    console.log(err);
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
