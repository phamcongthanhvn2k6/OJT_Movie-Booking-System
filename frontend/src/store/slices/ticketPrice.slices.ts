import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TicketPrice } from "../../types/ticketPrice.type";
import API from "../../api";

interface TicketPriceState {
  list: TicketPrice[];
  loading: boolean;
  error: string | null;
}

const initialState: TicketPriceState = {
  list: [],
  loading: false,
  error: null,
};

// --- 1. Fetch All ---
export const fetchTicketPrices = createAsyncThunk<TicketPrice[], void>(
  "ticketPrices/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.ticketPrice.getAll();
      return response.data;
    } catch (err) {
      console.log(err);

      return rejectWithValue("Lỗi tải danh sách giá vé");
    }
  }
);

// --- 2. Create ---
export const createTicketPrice = createAsyncThunk<
  TicketPrice,
  Omit<TicketPrice, "id">
>("ticketPrices/create", async (data, { rejectWithValue }) => {
  try {
    const response = await API.ticketPrice.create(data);
    return response.data;
  } catch (err) {
    console.log(err);

    return rejectWithValue("Lỗi tạo giá vé mới");
  }
});

// --- 3. Update ---
export const updateTicketPriceThunk = createAsyncThunk<
  TicketPrice,
  TicketPrice
>("ticketPrices/update", async (data, { rejectWithValue }) => {
  try {
    const response = await API.ticketPrice.update(data);
    return response.data;
  } catch (err) {
    console.log(err);

    return rejectWithValue("Lỗi cập nhật giá vé");
  }
});

// --- 4. Delete ---
export const deleteTicketPriceThunk = createAsyncThunk<string, string>(
  "ticketPrices/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.ticketPrice.delete(id);
      return id;
    } catch (err) {
      console.log(err);

      return rejectWithValue("Lỗi xóa giá vé");
    }
  }
);

const ticketPriceSlice = createSlice({
  name: "ticketPrice",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTicketPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTicketPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createTicketPrice.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Update
      .addCase(updateTicketPriceThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteTicketPriceThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearError } = ticketPriceSlice.actions;
export default ticketPriceSlice.reducer;
