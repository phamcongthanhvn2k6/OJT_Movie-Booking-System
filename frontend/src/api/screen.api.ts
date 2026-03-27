import axios from "axios";
import type { Screen } from "../types/screens.type";

const BASE_URL = import.meta.env.VITE_LOCAL;

const screenAPI = {
  // Lấy tất cả phòng chiếu
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/screens`);
      return response;
    } catch (err) {
      console.error("Get All Screens Error:", err);
      throw err;
    }
  },

  // ID Rạp là string
  getByTheaterId: async (theaterId: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/screens?theater_id=${theaterId}`
      );
      return response;
    } catch (err) {
      console.error("Get Screens Error:", err);
      throw err;
    }
  },

  create: async (data: Screen) => {
    try {
      // Loại bỏ id nếu có để json-server tự generate
      const { ...createData } = data;
      const response = await axios.post(`${BASE_URL}/screens`, createData);
      return response;
    } catch (err) {
      console.error("Create Screen Error:", err);
      throw err;
    }
  },

  update: async (data: Screen) => {
    try {
      const response = await axios.put(`${BASE_URL}/screens/${data.id}`, data);
      return response;
    } catch (err) {
      console.error("Update Screen Error:", err);
      throw err;
    }
  },

  // ID xóa là string
  delete: async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/screens/${id}`);
      return id;
    } catch (err) {
      console.error("Delete Screen Error:", err);
      throw err;
    }
  },
};

export default screenAPI;
