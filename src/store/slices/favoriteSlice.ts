import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../index'; 

// Interface Movie hiển thị trên UI
export interface Movie {
  id: number;
  title: string;
  image: string; 
  duration?: string;
  genre?: string;
  type?: string;
  rating?: number;
  age?: string;
}

interface FavoriteState {
  items: Movie[]; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FavoriteState = {
  items: [],
  status: 'idle',
  error: null,
};

const BASE_URL = 'http://localhost:5000';

// --- 1. FETCH FAVORITES ---
export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const currentUser = state.auth.user;

    if (!currentUser) return rejectWithValue('Chưa đăng nhập');

    try {
      // B1: Lấy danh sách ID mới nhất từ Server
      const userRes = await axios.get(`${BASE_URL}/users/${currentUser.id}`);
      const favoriteIds: number[] = userRes.data.favorites || [];

      if (favoriteIds.length === 0) return [];

      // B2: Map ID -> Movie Object
      const movieRequests = favoriteIds.map((id) => 
        axios.get(`${BASE_URL}/movies/${id}`)
      );
      
      const responses = await Promise.all(movieRequests);
      return responses.map(res => res.data);

    } catch (error) {
      console.error('Lỗi tải danh sách yêu thích:', error);
      return rejectWithValue('Lỗi tải danh sách');
    }
  }
);

// --- 2. ADD TO FAVORITES ---
export const addToFavorites = createAsyncThunk(
  'favorites/add',
  async (movie: Movie, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const currentUser = state.auth.user;

    if (!currentUser) return rejectWithValue('Chưa đăng nhập');

    try {
      // B1: Lấy favorites hiện tại từ Server
      const userRes = await axios.get(`${BASE_URL}/users/${currentUser.id}`);
      const currentFavorites: number[] = userRes.data.favorites || [];

      // B2: Check trùng (Ép kiểu Number cho chắc chắn)
      if (currentFavorites.some(id => Number(id) === Number(movie.id))) {
        return rejectWithValue('Đã tồn tại');
      }

      // B3: Thêm ID mới
      const updatedFavorites = [...currentFavorites, movie.id];

      // B4: Cập nhật Server
      await axios.patch(`${BASE_URL}/users/${currentUser.id}`, {
        favorites: updatedFavorites,
      });

      return movie; // Trả về Object để Redux hiển thị

    } catch (error) {
      console.error('Lỗi thêm yêu thích:', error);
      return rejectWithValue('Lỗi thêm yêu thích');
    }
  }
);

// --- 3. REMOVE FROM FAVORITES (SỬA LỖI KHÔNG XÓA ĐƯỢC TẠI ĐÂY) ---
export const removeFromFavorites = createAsyncThunk(
  'favorites/remove',
  async (movieId: number, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const currentUser = state.auth.user;

    if (!currentUser) return rejectWithValue('Chưa đăng nhập');

    try {
      // B1: Lấy favorites hiện tại từ Server
      const userRes = await axios.get(`${BASE_URL}/users/${currentUser.id}`);
      const currentFavorites: number[] = userRes.data.favorites || [];

      // B2: Lọc bỏ ID cần xóa (FIX: Ép kiểu Number để so sánh chính xác)
      const updatedFavorites = currentFavorites.filter((id) => Number(id) !== Number(movieId));

      // B3: Cập nhật Server
      await axios.patch(`${BASE_URL}/users/${currentUser.id}`, {
        favorites: updatedFavorites,
      });

      return movieId; // Trả về ID để Redux xóa khỏi state

    } catch (error) {
      console.error('Lỗi xóa yêu thích:', error);
      return rejectWithValue('Lỗi xóa yêu thích');
    }
  }
);

export const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        // Xóa item khỏi state items
        state.items = state.items.filter((item) => Number(item.id) !== Number(action.payload));
      });
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;