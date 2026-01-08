import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookingReducer from "./slices/booking.slices";
import movieReducer from "./slices/movie.slices";
import newsReducer from "./slices/news.slices";
import showtimeReducer from "./slices/showtime.slices";
import theaterReducer from "./slices/theater.slices";
import userReducer from "./slices/user.slices";
import genreReducer from "./slices/genre.slices";
import eventReducer from "./slices/event.slice";
import favoriteReducer from "./slices/favoriteSlice";
import screenReducer from "./slices/screen.slices";
import seatReducer from "./slices/seat.slices";
import ticketPriceReducer from "./slices/ticketPrice.slices";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    movie: movieReducer,
    news: newsReducer,
    showtime: showtimeReducer,
    theater: theaterReducer,
    user: userReducer,
    genre: genreReducer,
    events: eventReducer,
    favorite: favoriteReducer,
    screen: screenReducer,
    seat: seatReducer,
    ticketPrice: ticketPriceReducer,
  },
});

// Export types để dùng cho TypeScript chính xác hơn
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
