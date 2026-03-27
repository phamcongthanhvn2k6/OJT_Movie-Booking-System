/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Film, Clock, MapPin, Monitor, Eye, X, Printer, CreditCard, CheckCircle } from "lucide-react";

// --- REDUX STORE & ACTIONS ---
import type { AppDispatch, RootState } from "../../store";
import { fetchBookings } from "../../store/slices/booking.slices"; // Đã xóa updateBookingThunk
import { fetchUsers } from "../../store/slices/user.slices";
import { fetchMovies } from "../../store/slices/movie.slices";
import { fetchShowtimes } from "../../store/slices/showtime.slices";
import { fetchTheaters } from "../../store/slices/theater.slices";
import { fetchScreens } from "../../store/slices/screen.slices";

const BookingManagement = () => {
  const dispatch = useDispatch<AppDispatch>();

  // --- GLOBAL STATE ---
  const { list: bookings, loading } = useSelector((state: RootState) => state.booking);
  const { list: users } = useSelector((state: RootState) => state.user);
  const { list: movies } = useSelector((state: RootState) => state.movie);
  const { list: showtimes } = useSelector((state: RootState) => state.showtime);
  const { list: theaters } = useSelector((state: RootState) => state.theater);
  const { list: screens } = useSelector((state: RootState) => state.screen);

  // --- LOCAL STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMovieId, setFilterMovieId] = useState<string>("");
  const [filterTheaterId, setFilterTheaterId] = useState<string>("");
  
  // State Modal Xem chi tiết
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // --- INIT DATA ---
  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchUsers());
    dispatch(fetchMovies());
    dispatch(fetchShowtimes());
    dispatch(fetchTheaters());
    dispatch(fetchScreens());
  }, [dispatch]);

  // --- DATA MAPPING ---
  const enrichedBookings = useMemo(() => {
    return bookings.map((booking) => {
      // Ép kiểu String để so sánh chính xác id string/number
      const user = users.find((u) => String(u.id) === String(booking.user_id));
      const showtime = showtimes.find((s) => String(s.id) === String(booking.showtime_id));
      const movie = showtime ? movies.find((m) => String(m.id) === String(showtime.movie_id)) : null;
      const screen = showtime ? screens.find((s) => String(s.id) === String(showtime.screen_id)) : null;
      
      // LOGIC TÌM RẠP
      const theater = screen ? theaters.find((t) => String(t.id) === String(screen.theater_id)) : null;

      const mockSeats = Array.from({ length: booking.total_seat || 0 }, (_, i) => 
        `${String.fromCharCode(65 + Math.floor(i / 10))}${i % 10 + 1}`
      );

      return {
        ...booking,
        // Nếu user_id = -1 hoặc không tìm thấy -> Khách vãng lai
        isGuest: !user || String(booking.user_id) === "-1",
        userName: user ? `${user.first_name} ${user.last_name}` : "Khách vãng lai",
        userEmail: user?.email || "Chưa cập nhật",
        userPhone: user?.phone || "Chưa cập nhật",
        userAvatar: user?.avatar,
        
        movieTitle: movie?.title || "Không xác định",
        moviePoster: movie?.image, 
        movieId: movie?.id,
        
        screenName: screen?.name || "N/A",
        theaterName: theater?.name || "Không xác định",
        theaterId: theater?.id,
        
        startTime: showtime?.start_time,
        seatList: mockSeats, 
      };
    });
  }, [bookings, users, movies, showtimes, screens, theaters]);

  // --- FILTER LOGIC ---
  const filteredBookings = enrichedBookings.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      String(item.id).toLowerCase().includes(searchLower) ||
      item.userName.toLowerCase().includes(searchLower) ||
      item.userEmail.toLowerCase().includes(searchLower) ||
      item.movieTitle.toLowerCase().includes(searchLower);
    const matchesMovie = filterMovieId ? String(item.movieId) === String(filterMovieId) : true;
    const matchesTheater = filterTheaterId ? String(item.theaterId) === String(filterTheaterId) : true;

    return matchesSearch && matchesMovie && matchesTheater;
  });

  // --- FORMATTERS ---
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[80vh] font-sans relative">
      
      {/* HEADER & FILTER */}
      <div className="flex flex-col gap-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đặt vé</h1>
         <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
             <div className="md:col-span-5 relative">
                <input type="text" placeholder="Tìm kiếm..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
             </div>
             <div className="md:col-span-3 relative">
                <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterMovieId} onChange={e=>setFilterMovieId(e.target.value)}>
                    <option value="">-- Tất cả Phim --</option>
                    {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
             </div>
             <div className="md:col-span-3 relative">
                <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterTheaterId} onChange={e=>setFilterTheaterId(e.target.value)}>
                    <option value="">-- Tất cả Rạp --</option>
                    {theaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
             </div>
             <div className="md:col-span-1">
                {(searchTerm || filterMovieId || filterTheaterId) && (
                    <button onClick={() => {setSearchTerm(""); setFilterMovieId(""); setFilterTheaterId("")}} className="w-full h-full bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-bold text-gray-600">RESET</button>
                )}
             </div>
         </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div></div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                    <th className="px-6 py-4">Mã Vé</th>
                    <th className="px-6 py-4">Khách Hàng</th>
                    <th className="px-6 py-4">Phim / Suất</th>
                    <th className="px-6 py-4">Rạp / Phòng</th>
                    <th className="px-6 py-4 text-center">SL Ghế</th>
                    <th className="px-6 py-4 text-right">Tổng Tiền</th>
                    <th className="px-6 py-4 text-center">Chi tiết</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700 bg-white">
                {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-blue-600 font-medium">#{booking.id}</td>
                    
                    {/* Cột Khách hàng */}
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                <img src={booking.userAvatar || `https://ui-avatars.com/api/?name=${booking.userName}`} alt="avar" className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-semibold ${booking.isGuest ? 'text-amber-600 italic' : 'text-gray-800'}`}>
                                    {booking.userName}
                                </span>
                                <span className="text-xs text-gray-500">{booking.userEmail}</span>
                            </div>
                        </div>
                    </td>

                    <td className="px-6 py-4">
                        <div className="font-bold text-indigo-700 max-w-[150px] truncate" title={booking.movieTitle}>{booking.movieTitle}</div>
                        <div className="text-xs text-gray-500">{formatDate(booking.startTime)}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div>{booking.theaterName}</div>
                        <div className="text-xs text-gray-500 bg-gray-100 w-fit px-1 rounded">{booking.screenName}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold text-xs">
                            {booking.total_seat}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                        {formatCurrency(booking.total_price_movie)}
                    </td>
                    
                    {/* Cột Thao tác: Chỉ còn Xem chi tiết */}
                    <td className="px-6 py-4 text-center">
                        <button 
                            onClick={() => setSelectedBooking(booking)}
                            className="text-blue-500 hover:bg-blue-100 p-2 rounded-full transition-all"
                            title="Xem chi tiết"
                        >
                            <Eye size={20} />
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      )}

      {/* --- MODAL XEM CHI TIẾT --- */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
             
             {/* Modal Header */}
             <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
                  <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                          <CheckCircle className="text-emerald-400" /> 
                          Chi tiết Đơn hàng #{selectedBooking.id}
                      </h2>
                      <p className="text-gray-400 text-sm mt-1">Đã thanh toán thành công lúc {formatDate(selectedBooking.created_at)}</p>
                  </div>
                  <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white transition-colors">
                      <X size={24} />
                  </button>
             </div>

             {/* Modal Body */}
             <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Cột Trái: Thông tin phim & Ảnh */}
                    <div className="space-y-6">
                        <div className="flex gap-4">
                             <div className="w-24 h-36 bg-gray-200 rounded-lg shrink-0 overflow-hidden shadow-md relative group">
                                {selectedBooking.moviePoster ? (
                                    <img 
                                        src={selectedBooking.moviePoster} 
                                        alt={selectedBooking.movieTitle} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : null}
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500 -z-10">
                                    <Film size={32} />
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{selectedBooking.movieTitle}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                    <Clock size={14} /> {formatDate(selectedBooking.startTime)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <MapPin size={14} /> {selectedBooking.theaterName}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <Monitor size={14} /> {selectedBooking.screenName}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Thông tin Khách hàng</h4>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {selectedBooking.userName.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">{selectedBooking.userName}</div>
                                    <div className="text-xs text-gray-500">ID: {selectedBooking.user_id}</div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>📧 {selectedBooking.userEmail}</p>
                                <p>📞 {selectedBooking.userPhone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cột Phải: Chi tiết vé & Thanh toán */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                Danh sách ghế ({selectedBooking.total_seat})
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                                {selectedBooking.seatList.map((seat: string, idx: number) => (
                                    <span key={idx} className="bg-indigo-100 text-indigo-700 text-center py-1.5 rounded font-bold text-sm border border-indigo-200">
                                        {seat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4">
                            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                <CreditCard size={16} /> Thông tin thanh toán
                            </h4>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Giá vé cơ bản</span>
                                <span className="font-medium">---</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Phụ thu / Combo</span>
                                <span className="font-medium">0 đ</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-extrabold text-emerald-600 mt-4 pt-4 border-t border-gray-200">
                                <span>TỔNG CỘNG</span>
                                <span>{formatCurrency(selectedBooking.total_price_movie)}</span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* Modal Footer */}
             <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t border-gray-200">
                <button 
                    onClick={() => window.print()} 
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition shadow-sm font-medium"
                >
                    <Printer size={18} /> In hóa đơn
                </button>
                <button 
                    onClick={() => setSelectedBooking(null)} 
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition shadow-lg shadow-gray-400/50 font-bold"
                >
                    Đóng
                </button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default BookingManagement;