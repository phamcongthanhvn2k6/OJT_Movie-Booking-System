import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Seat } from "../../types/seat.type";
import API from "../../api";

interface SeatState {
  list: Seat[];
  loading: boolean;
}

const initialState: SeatState = { list: [], loading: false };

// --- Thunks ---
export const fetchSeatsByScreen = createAsyncThunk<Seat[], string>(
  "seats/fetchByScreen",
  async (screenId) => (await API.seat.getSeatsByScreenId(screenId)).data
);

export const createSeat = createAsyncThunk<Seat, Omit<Seat, "id" | "created_at" | "updated_at">>(
  "seats/create",
  async (data) => {
    // json-server sẽ tự động generate ID, không cần truyền id
    const seatData = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return (await API.seat.create(seatData as Seat)).data;
  }
);

// [NEW] Update Thunk
export const updateSeat = createAsyncThunk<Seat, Seat>(
  "seats/update",
  async (data) =>
    (
      await API.seat.update({
        ...data,
        id: data.id,
        created_at: data.created_at || new Date(),
        updated_at: new Date(),
      })
    ).data
);

export const deleteSeat = createAsyncThunk<string, string>(
  "seats/delete",
  async (id) => await API.seat.delete(id)
);

const seatSlice = createSlice({
  name: "seats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeatsByScreen.pending, (state) => {
        state.loading = true;
        state.list = []; // Clear list khi bắt đầu fetch
      })
      .addCase(fetchSeatsByScreen.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchSeatsByScreen.rejected, (state) => {
        state.loading = false;
        state.list = [];
      })
      .addCase(createSeat.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Handle Update Logic
      .addCase(updateSeat.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteSeat.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
      });
  },
});

export default seatSlice.reducer;
