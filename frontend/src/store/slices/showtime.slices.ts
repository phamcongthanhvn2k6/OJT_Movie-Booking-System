import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Showtime } from "../../types/showtime.type";
import API from "../../api";

interface ShowtimeState {
  list: Showtime[];
  currentShowtime: Showtime | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShowtimeState = {
  list: [],
  currentShowtime: null,
  loading: false,
  error: null,
};

// --- Lấy danh sách Suất chiếu ---
export const fetchShowtimes = createAsyncThunk<
  Showtime[],
  { movieId?: string; date?: string } | undefined
>("showtimes/fetchAll", async (params, { rejectWithValue }) => {
  const response = await API.showtime.getAll(params);

  if (!response) {
    return rejectWithValue("Lỗi kết nối server");
  }

  return response.data;
});

// --- Lấy chi tiết Suất chiếu ---
export const fetchShowtimeDetail = createAsyncThunk<Showtime, string>(
  "showtimes/fetchDetail",
  async (id, { rejectWithValue }) => {
    const response = await API.showtime.getById({ id });

    if (!response) {
      return rejectWithValue("Không tìm thấy suất chiếu");
    }

    return response.data;
  }
);

// --- Tạo Suất chiếu mới ---
// Sử dụng Omit đúng như API định nghĩa
export const createNewShowtime = createAsyncThunk<
  Showtime,
  Omit<Showtime, "id" | "created_at" | "updated_at">
>("showtimes/create", async (data, { rejectWithValue }) => {
  try {
    const response = await API.showtime.create(data);
    return response.data;
  } catch (error) {
    console.log("Lỗi tạo showtime", error);
    return rejectWithValue("Lỗi khi tạo suất chiếu");
  }
});

// --- Cập nhật Suất chiếu ---
export const updateShowtimeThunk = createAsyncThunk<Showtime, Showtime>(
  "showtimes/update",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.showtime.put(data);
      return response.data;
    } catch (error) {
      console.log("Lỗi update showtime", error);
      return rejectWithValue("Lỗi khi cập nhật suất chiếu");
    }
  }
);

// --- Xóa Suất chiếu ---
export const deleteShowtimeThunk = createAsyncThunk<string, string>(
  "showtimes/delete",
  async (id, { rejectWithValue }) => {
    const resultId = await API.showtime.delete(id);

    if (!resultId) {
      return rejectWithValue("Lỗi khi xóa suất chiếu");
    }

    return resultId;
  }
);

const showtimeSlice = createSlice({
  name: "showtimes",
  initialState,
  reducers: {
    clearCurrentShowtime: (state) => {
      state.currentShowtime = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchShowtimes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowtimes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchShowtimes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Detail
      .addCase(fetchShowtimeDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShowtimeDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShowtime = action.payload;
      })

      // Create
      .addCase(createNewShowtime.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })

      // Update
      .addCase(updateShowtimeThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentShowtime?.id === action.payload.id) {
          state.currentShowtime = action.payload;
        }
      })

      // Delete
      .addCase(deleteShowtimeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((s) => s.id !== action.payload);
      });
  },
});

export const { clearCurrentShowtime, clearError } = showtimeSlice.actions;
export default showtimeSlice.reducer;
