import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import db from '../../../db.json'; 

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
  return new Promise<Event[]>((resolve) => {
    setTimeout(() => resolve(db.events as unknown as Event[]), 300); 
  });
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
  const response = await fetch('http://localhost:5000/events', { // URL JSON Server của bạn
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