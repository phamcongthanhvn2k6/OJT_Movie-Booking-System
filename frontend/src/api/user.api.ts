import axios from "axios";
import type { User } from "../types/user.type";

// Lấy danh sách tất cả user (Admin)
export async function getAllUsers() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_LOCAL}/users`);
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function getUserById(data: { id: string }) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_LOCAL}/users/${data.id}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function updateUser(data: User) {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_LOCAL}/users/${data.id}`,
      data
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Xóa User (Admin)
export async function deleteUser(id: string) {
  try {
    await axios.delete(`${import.meta.env.VITE_LOCAL}/users/${id}`);
    return id;
  } catch (err) {
    console.log(err);
  }
}

const userAPI = {
  getAll: getAllUsers,
  getById: getUserById,
  put: updateUser,
  delete: deleteUser,
};

export default userAPI;
