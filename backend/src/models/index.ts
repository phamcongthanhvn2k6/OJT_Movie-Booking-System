import mongoose, { Schema } from 'mongoose';

// Helper to configure virtual id for JSON output
const configureSchema = (schema: Schema) => {
  schema.virtual('id').get(function(this: any) {
    return this._id;
  });
  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });
};

// 1. User Schema
const UserSchema = new Schema({
  _id: { type: String, required: true },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { versionKey: false });
configureSchema(UserSchema);
export const User = mongoose.model('User', UserSchema, 'users');

// 2. Genre Schema
const GenreSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String }
}, { versionKey: false });
configureSchema(GenreSchema);
export const Genre = mongoose.model('Genre', GenreSchema, 'genres');

// 3. Theater Schema
const TheaterSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String },
  address: { type: String },
  city: { type: String }
}, { versionKey: false });
configureSchema(TheaterSchema);
export const Theater = mongoose.model('Theater', TheaterSchema, 'theaters');

// 4. Movie Schema
const MovieSchema = new Schema({
  _id: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  duration: { type: Number },
  release_date: { type: Date },
  poster_url: { type: String },
  trailer_url: { type: String },
  status: { type: String },
  image: { type: String },
  trailer: { type: String },
  type: { type: String },
  genre: { type: String },
  country: { type: String },
  actors: { type: String },
  author: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { versionKey: false });
configureSchema(MovieSchema);
export const Movie = mongoose.model('Movie', MovieSchema, 'movies');

// 5. Screen Schema
const ScreenSchema = new Schema({
  _id: { type: String, required: true },
  theater_id: { type: String },
  name: { type: String },
  screen_type: { type: String }
}, { versionKey: false });
configureSchema(ScreenSchema);
export const Screen = mongoose.model('Screen', ScreenSchema, 'screens');

// 6. Showtime Schema
const ShowtimeSchema = new Schema({
  _id: { type: String, required: true },
  movie_id: { type: String },
  screen_id: { type: String },
  theater_id: { type: String },
  start_time: { type: Date },
  end_time: { type: Date },
  price: { type: Number }
}, { versionKey: false });
configureSchema(ShowtimeSchema);
export const Showtime = mongoose.model('Showtime', ShowtimeSchema, 'showtimes');

// 7. Seat Schema
const SeatSchema = new Schema({
  _id: { type: String, required: true },
  screen_id: { type: String },
  row_name: { type: String },
  number: { type: Number },
  type: { type: String },
  status: { type: String }
}, { versionKey: false });

SeatSchema.virtual('id').get(function(this: any) {
  return this._id;
});
SeatSchema.virtual('seat_number').get(function(this: any) {
  return this.row_name && this.number ? `${this.row_name}${this.number}` : this._id;
});
SeatSchema.set('toJSON', { virtuals: true });
SeatSchema.set('toObject', { virtuals: true });

export const Seat = mongoose.model('Seat', SeatSchema, 'seats');

// 8. Booking Schema
const BookingSchema = new Schema({
  _id: { type: String, required: true },
  user_id: { type: String },
  showtime_id: { type: String },
  total_price: { type: Number },
  total_price_movie: { type: Number }, // Support both SQL Server variations
  booking_time: { type: Date, default: Date.now },
  status: { type: String }
}, { versionKey: false });
configureSchema(BookingSchema);
export const Booking = mongoose.model('Booking', BookingSchema, 'bookings');

// 9. BookingSeat Schema
const BookingSeatSchema = new Schema({
  _id: { type: String, required: true },
  booking_id: { type: String },
  seat_id: { type: String },
  price: { type: Number }
}, { versionKey: false });
configureSchema(BookingSeatSchema);
export const BookingSeat = mongoose.model('BookingSeat', BookingSeatSchema, 'booking_seats');

// 10. Payment Schema
const PaymentSchema = new Schema({
  _id: { type: String, required: true },
  booking_id: { type: String },
  amount: { type: Number },
  payment_status: { type: String },
  payment_method: { type: String },
  payment_time: { type: Date },
  transaction_id: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { versionKey: false });
configureSchema(PaymentSchema);
export const Payment = mongoose.model('Payment', PaymentSchema, 'payments');

// 11. TicketPrice Schema
const TicketPriceSchema = new Schema({
  _id: { type: String, required: true },
  seat_type: { type: String },
  screen_type: { type: String },
  day_type: { type: String },
  price: { type: Number }
}, { versionKey: false });
configureSchema(TicketPriceSchema);
export const TicketPrice = mongoose.model('TicketPrice', TicketPriceSchema, 'ticket_prices');

// 12. Event Schema
const EventSchema = new Schema({
  _id: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  image_url: { type: String },
  start_date: { type: Date },
  end_date: { type: Date },
  venues: { type: Schema.Types.Mixed } // Array or JSON string
}, { versionKey: false });
configureSchema(EventSchema);
export const Event = mongoose.model('Event', EventSchema, 'events');

// 13. News Schema
const NewsSchema = new Schema({
  _id: { type: String, required: true },
  title: { type: String },
  content: { type: String },
  image_url: { type: String },
  created_at: { type: Date, default: Date.now }
}, { versionKey: false });
configureSchema(NewsSchema);
export const News = mongoose.model('News', NewsSchema, 'News');

// Map table names to Mongoose models
export const modelsMap: { [key: string]: mongoose.Model<any> } = {
  users: User,
  genres: Genre,
  theaters: Theater,
  movies: Movie,
  screens: Screen,
  showtimes: Showtime,
  seats: Seat,
  bookings: Booking,
  booking_seats: BookingSeat,
  payments: Payment,
  ticket_prices: TicketPrice,
  events: Event,
  News: News
};
