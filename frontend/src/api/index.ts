import bookingAPI from "./booking.api";
import genreAPI from "./genre.api";
import movieAPI from "./movie.api";
import newsAPI from "./news.api";
import screenAPI from "./screen.api";
import seatAPI from "./seat.api";
import showtimeAPI from "./showtime.api";
import theaterAPI from "./theater.api";
import { ticketPriceAPI } from "./ticketPrice.api";
import userAPI from "./user.api";

const API = {
  booking: bookingAPI,
  movie: movieAPI,
  news: newsAPI,
  showtime: showtimeAPI,
  theater: theaterAPI,
  user: userAPI,
  genre: genreAPI,
  screen: screenAPI,
  seat: seatAPI,
  ticketPrice: ticketPriceAPI,
};

export default API;
