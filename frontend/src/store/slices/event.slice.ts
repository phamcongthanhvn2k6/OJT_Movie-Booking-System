import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Event {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  detailTittle?: string; 
  bannerUrl?: string;
  posterUrl?: string;
  venues?: string[];
  website?: string;
  note?: string;
}

interface EventState {
  list: Event[];
  loading: boolean;
}

const initialState: EventState = {
  list: [], 
  loading: false,
};

export const fetchEvents = createAsyncThunk<Event[]>('events/fetchEvents', async () => {
    const response = await axios.get(`${import.meta.env.VITE_LOCAL}/events`);
    return response.data;
});

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; 
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.loading = false;
      });
  },
});

const addEventAPI = async (eventData: Event) => {
  const response = await fetch(`${import.meta.env.VITE_LOCAL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  return response.json();
};

// 2. Tạo Async Thunk
export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (newEvent: Event, thunkAPI) => {
    try {
      const data = await addEventAPI(newEvent);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export default eventSlice.reducer;