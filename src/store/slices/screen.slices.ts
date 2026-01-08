import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Screen } from "../../types/screens.type";
import API from "../../api";

interface ScreenState {
  list: Screen[];
  loading: boolean;
  error: string | null;
}

const initialState: ScreenState = { list: [], loading: false, error: null };

// --- Thunks (Dùng String ID) ---

// 1. Lấy tất cả màn hình
export const fetchScreens = createAsyncThunk<Screen[], void>(
  "screens/fetchAll",
  async () => (await API.screen.getAll()).data
);

// 2. Lấy theo Rạp (theaterId: string)
export const fetchScreensByTheater = createAsyncThunk<Screen[], string>(
  "screens/fetchByTheater",
  async (theaterId) => (await API.screen.getByTheaterId(theaterId)).data
);

export const createScreen = createAsyncThunk<Screen, Omit<Screen, "id" | "created_at" | "updated_at">>(
  "screens/create",
  async (data) => {
    // Không truyền id để json-server tự generate
    const screenData: Omit<Screen, "id"> = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return (await API.screen.create(screenData as Screen)).data;
  }
);

export const updateScreen = createAsyncThunk<Screen, Screen>(
  "screens/update",
  async (data) => {
    if (!data.id) {
      throw new Error("Screen ID is required for update");
    }
    return (
      await API.screen.update({
        ...data,
        id: String(data.id),
        created_at: data.created_at || new Date(),
        updated_at: new Date(),
      })
    ).data;
  }
);

// 3. Xóa (id: string)
export const deleteScreen = createAsyncThunk<string, string>(
  "screens/delete",
  async (id) => await API.screen.delete(id)
);

const screenSlice = createSlice({
  name: "screens",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchScreens.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      // Fetch By Theater (Đã xóa phần bị trùng lặp ở đây)
      .addCase(fetchScreensByTheater.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      // Create
      .addCase(createScreen.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update
      .addCase(updateScreen.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      // Delete (So sánh string)
      .addCase(deleteScreen.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => String(s.id) !== action.payload);
      });
  },
});

export default screenSlice.reducer;
