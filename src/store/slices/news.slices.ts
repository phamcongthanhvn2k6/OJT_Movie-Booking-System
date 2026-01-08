import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import db from '../../../db.json';

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
  return new Promise<NewsItem[]>((resolve) => {
    
    const database = db as unknown as { News: NewsItem[] };
    
    const data = database.News || []; 
    
    setTimeout(() => resolve(data), 300);
  });
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