import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Booking } from "../../types/booking.type";
import API from "../../api";

interface BookingState {
  list: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  list: [],
  currentBooking: null,
  loading: false,
  error: null,
};

// --- Lấy danh sách Booking ---
export const fetchBookings = createAsyncThunk<Booking[], void>(
  "bookings/fetchAll",
  async (_, { rejectWithValue }) => {
    // API bắt lỗi và trả về undefined nếu thất bại
    const response = await API.booking.getAll();

    if (!response) {
      return rejectWithValue("Lỗi kết nối server hoặc không lấy được dữ liệu");
    }

    return response.data;
  }
);

// --- Lấy chi tiết Booking ---
export const fetchBookingDetail = createAsyncThunk<Booking, string>(
  "bookings/fetchDetail",
  async (id) => {
    const response = await API.booking.getById(id);

    if (!response) {
      return "Không tìm thấy đơn hàng";
    }

    return response.data;
  }
);

export const createNewBooking = createAsyncThunk<
  Booking,
  Omit<Booking, "id" | "created_at">
>("bookings/create", async (data, { rejectWithValue }) => {
  try {
    const response = await API.booking.create(data as Booking);
    return response.data;
  } catch (error) {
    console.log("Lỗi tạo booking", error);
    return rejectWithValue("Lỗi khi đặt vé");
  }
});

// --- Cập nhật Booking ---
export const updateBookingThunk = createAsyncThunk<Booking, Booking>(
  "bookings/update",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.booking.put(data);
      return response.data;
    } catch (error) {
      console.log("Lỗi cập nhật booking", error);
      return rejectWithValue("Lỗi khi cập nhật đơn hàng");
    }
  }
);

// --- Xóa Booking ---
export const deleteBookingThunk = createAsyncThunk<string, string>(
  "bookings/delete",
  async (id, { rejectWithValue }) => {
    // API delete trả về id hoặc undefined
    const resultId = await API.booking.delete(id);

    if (!resultId) {
      return rejectWithValue("Lỗi khi xóa đơn hàng");
    }

    return resultId;
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Detail
      .addCase(fetchBookingDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })

      // Create
      .addCase(createNewBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })

      // Update
      .addCase(updateBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })

      // Delete
      .addCase(deleteBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((b) => b.id !== action.payload);
      });
  },
});

export const { clearCurrentBooking, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
