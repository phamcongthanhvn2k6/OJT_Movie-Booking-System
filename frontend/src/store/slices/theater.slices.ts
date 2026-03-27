import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Theater } from "../../types/theater.type"; // Giả sử bạn đã có type này
import API from "../../api";

interface TheaterState {
  list: Theater[];
  currentTheater: Theater | null;
  loading: boolean;
  error: string | null;
}

const initialState: TheaterState = {
  list: [],
  currentTheater: null,
  loading: false,
  error: null,
};

// --- Lấy danh sách Rạp ---
export const fetchTheaters = createAsyncThunk<Theater[], void>(
  "theaters/fetchAll",
  async (_, { rejectWithValue }) => {
    const response = await API.theater.getAll();
    if (!response) return rejectWithValue("Lỗi server");
    return response.data;
  }
);

// --- Lấy chi tiết Rạp ---
export const fetchTheaterDetail = createAsyncThunk<Theater, string>(
  "theaters/fetchDetail",
  async (id, { rejectWithValue }) => {
    const response = await API.theater.getById({ id });
    if (!response) return rejectWithValue("Không tìm thấy rạp");
    return response.data;
  }
);

// --- Tạo Rạp mới ---
export const createNewTheater = createAsyncThunk<
  Theater,
  Omit<Theater, "id" | "created_at" | "updated_at">
>("theaters/create", async (data, { rejectWithValue }) => {
  try {
    const response = await API.theater.create(data);
    return response.data;
  } catch (error) {
    console.log("Lỗi tạo rạp", error);
    return rejectWithValue("Lỗi khi tạo rạp");
  }
});

// --- Cập nhật Rạp ---
export const updateTheaterThunk = createAsyncThunk<Theater, Theater>(
  "theaters/update",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.theater.put(data);
      return response.data;
    } catch (error) {
      console.log("Lỗi Cập nhật rạp", error);
      return rejectWithValue("Lỗi khi cập nhật rạp");
    }
  }
);

// --- Xóa Rạp ---
export const deleteTheaterThunk = createAsyncThunk<string, string>(
  "theaters/delete",
  async (id, { rejectWithValue }) => {
    const resultId = await API.theater.delete(id);
    if (!resultId) return rejectWithValue("Lỗi khi xóa rạp");
    return resultId;
  }
);

const theaterSlice = createSlice({
  name: "theaters",
  initialState,
  reducers: {
    clearCurrentTheater: (state) => {
      state.currentTheater = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTheaters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTheaters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTheaters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Detail
      .addCase(fetchTheaterDetail.fulfilled, (state, action) => {
        state.currentTheater = action.payload;
      })
      // Create
      .addCase(createNewTheater.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update
      .addCase(updateTheaterThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
        if (state.currentTheater?.id === action.payload.id) {
          state.currentTheater = action.payload;
        }
      })
      // Delete
      .addCase(deleteTheaterThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      });
  },
});

export const { clearCurrentTheater, clearError } = theaterSlice.actions;
export default theaterSlice.reducer;
