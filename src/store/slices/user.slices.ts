import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";
import type { User } from "../../types/user.type";

interface UserState {
  list: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  list: [],
  currentUser: null,
  loading: false,
  error: null,
};

// --- Lấy danh sách User ---
export const fetchUsers = createAsyncThunk<User[], void>(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    const response = await API.user.getAll();
    if (!response) {
      return rejectWithValue("Không thể kết nối đến Server");
    }
    return response.data;
  }
);

// --- Lấy chi tiết User ---
export const fetchUserDetail = createAsyncThunk<User, string>(
  "users/fetchDetail",
  async (id, { rejectWithValue }) => {
    const response = await API.user.getById({ id });
    if (!response) {
      return rejectWithValue("Không tìm thấy user hoặc lỗi server");
    }
    return response.data;
  }
);

// --- Cập nhật User ---
export const updateUserThunk = createAsyncThunk<User, User>(
  "users/update",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.user.put(data);
      return response.data;
    } catch (error) {
      console.log("Lỗi cập nhật user", error);
      return rejectWithValue("Lỗi khi cập nhật user");
    }
  }
);

// --- Xóa User ---
export const deleteUserThunk = createAsyncThunk<string, string>(
  "users/delete",
  async (id, { rejectWithValue }) => {
    const resultId = await API.user.delete(id);
    if (!resultId) {
      return rejectWithValue("Lỗi khi xóa user");
    }
    return resultId;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Detail
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      // Update
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      // Delete
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((user) => user.id !== action.payload);
      });
  },
});

export const { clearCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;
