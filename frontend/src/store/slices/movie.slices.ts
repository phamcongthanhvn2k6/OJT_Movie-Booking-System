import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Movie } from "../../types/movie.type";
import API from "../../api";

interface MovieState {
  list: Movie[];
  currentMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  list: [],
  currentMovie: null,
  loading: false,
  error: null,
};

// --- Lấy danh sách phim ---
export const fetchMovies = createAsyncThunk<Movie[], void>(
  "movies/fetchAll",
  async (_, { rejectWithValue }) => {
    const response = await API.movie.getAll();
    if (!response) {
      return rejectWithValue("Không thể kết nối đến Server");
    }
    return response.data;
  }
);

// --- Lấy chi tiết phim ---
export const fetchMovieDetail = createAsyncThunk<Movie, string>(
  "movies/fetchDetail",
  async (id, { rejectWithValue }) => {
    const response = await API.movie.getById({ id });

    if (!response) {
      return rejectWithValue("Không tìm thấy phim hoặc lỗi server");
    }

    return response.data;
  }
);

// --- Tạo phim mới ---
export const createNewMovie = createAsyncThunk<
  Movie,
  Omit<Movie, "id" | "created_at" | "updated_at">
>("movies/create", async (data, { rejectWithValue }) => {
  try {
    // API createMovie của bạn có 'throw err', nên ta dùng try/catch ở đây để bắt
    const response = await API.movie.create(data);
    return response.data;
  } catch (error) {
    console.log("Lỗi tạo phim", error);

    return rejectWithValue("Lỗi khi tạo phim");
  }
});

// --- Cập nhật phim ---
export const updateMovieThunk = createAsyncThunk<Movie, Movie>(
  "movies/update",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.movie.put(data);
      return response.data;
    } catch (error) {
      console.log("Lỗi cập nhật phim", error);
      return rejectWithValue("Lỗi khi cập nhật phim");
    }
  }
);

// --- Xóa phim ---
export const deleteMovieThunk = createAsyncThunk<string, string>(
  "movies/delete",
  async (id, { rejectWithValue }) => {
    // API deleteMovie trả về id hoặc undefined
    const resultId = await API.movie.delete(id);

    if (!resultId) {
      return rejectWithValue("Lỗi khi xóa phim");
    }

    return resultId;
  }
);

// 3. Tạo Slice
const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMovieDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })

      .addCase(createNewMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })

      .addCase(updateMovieThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentMovie?.id === action.payload.id) {
          state.currentMovie = action.payload;
        }
      })

      .addCase(deleteMovieThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((movie) => movie.id !== action.payload);
      });
  },
});

export const { clearCurrentMovie, clearError } = movieSlice.actions;
export default movieSlice.reducer;
