import { Routes, Route, Navigate } from "react-router-dom";

// --- COMPONENTS & PAGES ---
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import HomePage from "./pages/homePage/HomePage";
import MediaPage from "./pages/mediaPage/mediaPage";
import NewsDetail from "./pages/mediaPage/components/newsDetail";
import FilmFestivalEvents from "./pages/EventsPage/EventsPage";
import EventsPageDetail from "./pages/EventsPage/components/EventsPageDetail";
import { Promotion } from "./pages/promotions/Promotion";
import { TicketPrice } from "./pages/ticketPrice/TicketPrice";
import { MovieDetail } from "./pages/MovieDetail/MovieDetail";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage/PaymentSuccessPage";

// --- ADMIN PAGES ---
import AdminLayout from "./components/admin/AdminLayout";
import MovieManagement from "./pages/admin/MovieManagement";
import UserManagement from "./pages/admin/UserManagement";
import NewsManagement from "./pages/admin/NewsManagement";
import EventsManagement from "./pages/admin/EventsManagement";
// --- GUARDS ---
import { ProtectedRoute } from "./components/ProtectedRoute";
import ShowtimePage from "./pages/ShowtimePage/ShowtimePage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import { PaymentPage } from "./pages/PaymentPage/PaymentPage";
import UserProfile from "./pages/UserProfile/UserProfile";
import TheaterManagement from "./pages/admin/TheaterManagerment";
import BookingManagement from "./pages/admin/BookingManagement";
import ShowtimeManagement from "./pages/admin/ShowitimeManagement";
import TicketPriceManagement from "./pages/admin/TicketPriceManagement";
import Dashboard from "./pages/admin/Dashboard";

const RouterSetup = () => {
  return (
    <Routes>
      {/* --- CÁC ROUTE CÔNG KHAI (PUBLIC) --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/tin-tuc" element={<MediaPage />} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/promotion" element={<Promotion />} />
      <Route path="/ticketprice" element={<TicketPrice />} />
      <Route path="/lien-hoan-phim" element={<FilmFestivalEvents />} />
      <Route path="/events/:id" element={<EventsPageDetail />} />
      <Route path="/showtimes" element={<ShowtimePage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      {/* Route Chi tiết phim (Dynamic ID) */}
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/payment/:movieId/:bookingId" element={<PaymentPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/profile" element={<UserProfile />} />

      {/* --- CÁC ROUTE ADMIN (PROTECTED) --- */}
      <Route
        path="/admin"
        element={
          /* Kiểm tra quyền Admin -> Nếu OK thì render Layout Admin */
          <ProtectedRoute allowedRoles={["admin", "STAFF"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Các Route con của Admin / STAFF*/}
        <Route index element={<Navigate to="movies" replace />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="movies" element={<MovieManagement />} />
        <Route path="theaters" element={<TheaterManagement />} />
        <Route path="News" element={<NewsManagement />} />
        <Route path="Events" element={<EventsManagement />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* <Route path="users" element={<UserManagement />} /> */}
        <Route path="showtime" element={<ShowtimeManagement />} />
        <Route path="price" element={<TicketPriceManagement />} />
      </Route>
      <Route
        path="/admin"
        element={
          /* Kiểm tra quyền Admin -> Nếu OK thì render Layout Admin */
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Các Route con của Admin */}
        <Route index element={<Navigate to="movies" replace />} />
        <Route path="movies" element={<MovieManagement />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* --- CÁC ROUTE KHÁC (404) --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RouterSetup;
