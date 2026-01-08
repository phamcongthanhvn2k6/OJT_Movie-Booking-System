/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAuthToken, removeAuthToken } from "../../services/auth.service";
import type { User } from "../../types/user.type";

interface AuthState {
  user: User; // Thông tin người dùng (id, name, role...)
  token: string | null; // Token định danh
  isAuthenticated: boolean;
  loading: boolean;
}

const initialUser: User = {
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  avatar: "",
  status: "ACTIVE",
  role: "USER",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const initialState: AuthState = {
  user: initialUser,
  token: getAuthToken(), // Lấy token từ localStorage khi khởi tạo trang
  isAuthenticated: !!getAuthToken(),
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Lưu thông tin vào RAM sau khi đăng nhập thành công
    loginSuccess: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    // Xóa sạch dữ liệu khỏi RAM khi đăng xuất
    logout: (state) => {
      state.user = initialUser;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      removeAuthToken(); // Xóa token ở localStorage
    },
    // Cập nhật thông tin User sau khi fetch từ API (dùng cho refresh trang)
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { loginSuccess, logout, setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
