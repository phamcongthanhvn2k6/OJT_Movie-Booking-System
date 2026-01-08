import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";
import type { Genre } from "../../types/genres.type";

interface GenreState {
  list: Genre[];
  currentGenre: Genre | null;
  loading: boolean;
  error: string | null;
}

const initialState: GenreState = {
  list: [],
  currentGenre: null,
  loading: false,
  error: null,
};

// --- Lấy danh sách thể loại ---
export const fetchGenres = createAsyncThunk<Genre[], void>(
  "genres/fetchAll",
  async (_, { rejectWithValue }) => {
    const response = await API.genre.getAll();

    if (!response) {
      return rejectWithValue(
        "Không thể kết nối đến Server hoặc lỗi lấy dữ liệu"
      );
    }

    return response.data;
  }
);

// --- Lấy chi tiết thể loại ---
export const fetchGenreDetail = createAsyncThunk<Genre, string>(
  "genres/fetchDetail",
  async (id, { rejectWithValue }) => {
    const response = await API.genre.getById({ id });

    if (!response) {
      return rejectWithValue("Không tìm thấy thể loại");
    }

    return response.data;
  }
);

// --- Tạo thể loại mới ---
export const createNewGenre = createAsyncThunk<Genre, Omit<Genre, "id">>(
  "genres/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.genre.create(data);
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue("Lỗi khi tạo thể loại");
    }
  }
);

// --- Cập nhật thể loại ---
export const updateGenreThunk = createAsyncThunk<Genre, Genre>(
  "genres/update",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.genre.put(data);
      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue("Lỗi khi cập nhật thể loại");
    }
  }
);

// --- Xóa thể loại ---
export const deleteGenreThunk = createAsyncThunk<string, string>(
  "genres/delete",
  async (id, { rejectWithValue }) => {
    const resultId = await API.genre.delete(id);

    if (!resultId) {
      return rejectWithValue("Lỗi khi xóa thể loại");
    }

    return resultId;
  }
);

const genreSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    clearCurrentGenre: (state) => {
      state.currentGenre = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Detail
      .addCase(fetchGenreDetail.fulfilled, (state, action) => {
        state.currentGenre = action.payload;
      })

      // Create
      .addCase(createNewGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })

      // Update
      .addCase(updateGenreThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentGenre?.id === action.payload.id) {
          state.currentGenre = action.payload;
        }
      })

      // Delete
      .addCase(deleteGenreThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((g) => g.id !== action.payload);
      });
  },
});

export const { clearCurrentGenre, clearError } = genreSlice.actions;
export default genreSlice.reducer;
