import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface NewsItem {
  id: string;
  title: string;
  image: string;
  date: string;
  lead?: string;
  content?: string;
  details?: string[];
  detailImage?: string;
}

interface NewsState {
  list: NewsItem[];
  loading: boolean;
}

const initialState: NewsState = {
  list: [],
  loading: false,
};

export const fetchNews = createAsyncThunk<NewsItem[]>('news/fetchNews', async () => {
    const response = await axios.get(`${import.meta.env.VITE_LOCAL}/News`);
    return response.data;
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNews.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default newsSlice.reducer;