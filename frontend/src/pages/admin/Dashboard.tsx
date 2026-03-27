/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  DollarSign,
  Ticket,
  Film,
  Users,
  TrendingUp,
  Calendar,
  CreditCard,
  Activity,
} from "lucide-react";

// Import Actions & Types
import type { AppDispatch, RootState } from "../../store";
import { fetchBookings } from "../../store/slices/booking.slices";
import { fetchMovies } from "../../store/slices/movie.slices";
import { fetchUsers } from "../../store/slices/user.slices";
import { fetchShowtimes } from "../../store/slices/showtime.slices";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // --- 1. LẤY DỮ LIỆU TỪ REDUX ---
  const { list: bookings, loading: bookingLoading } = useSelector(
    (state: RootState) => state.booking
  );
  const { list: movies } = useSelector((state: RootState) => state.movie);
  const { list: users } = useSelector((state: RootState) => state.user);
  const { list: showtimes } = useSelector((state: RootState) => state.showtime);

  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchMovies());
    dispatch(fetchUsers());
    dispatch(fetchShowtimes());
  }, [dispatch]);

  // --- 2. TÍNH TOÁN SỐ LIỆU (Business Logic) ---
  const stats = useMemo(() => {
    // A. Tổng doanh thu (Tính tổng tiền các booking)
    const totalRevenue = bookings.reduce(
      (sum, item) => sum + (item.total_price_movie || 0),
      0
    );

    // B. Tổng vé bán ra
    const totalTickets = bookings.reduce(
      (sum, item) => sum + (item.total_seat || 0),
      0
    );

    // C. Khách hàng mới (trong tháng này)
    const currentMonth = new Date().getMonth();
    const newUsers = users.filter((u) => {
        // Giả sử user có trường created_at, nếu không có thì tính tổng user active
        return u.status === 'ACTIVE'; 
    }).length;

    return {
      revenue: totalRevenue,
      tickets: totalTickets,
      moviesCount: movies.length,
      usersCount: users.length,
    };
  }, [bookings, movies, users]);

  // --- 3. CHUẨN BỊ DỮ LIỆU BIỂU ĐỒ ---

  // Biểu đồ 1: Doanh thu 7 ngày gần nhất
  const revenueChartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0]; // YYYY-MM-DD
    });

    return last7Days.map((date) => {
      // Tìm các booking trong ngày này
      const dailyRevenue = bookings
        .filter((b) => b.created_at && new Date(b.created_at).toISOString().split("T")[0] === date) // Dựa vào created_at của booking
        .reduce((sum, b) => sum + (b.total_price_movie || 0), 0);

      const displayDate = new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });

      return {
        name: displayDate,
        revenue: dailyRevenue,
      };
    });
  }, [bookings]);

  // Biểu đồ 2: Top 5 Phim doanh thu cao nhất
  const topMoviesData = useMemo(() => {
    // Map để lưu doanh thu theo movieId
    const movieRevenueMap: Record<string, number> = {};

    bookings.forEach((booking) => {
      // Cần tìm movieId thông qua showtimeId
      const showtime = showtimes.find(
        (s) => String(s.id) === String(booking.showtime_id)
      );
      if (showtime) {
        const movieId = String(showtime.movie_id);
        movieRevenueMap[movieId] =
          (movieRevenueMap[movieId] || 0) + (booking.total_price_movie || 0);
      }
    });

    // Convert sang mảng và sort
    const chartData = Object.keys(movieRevenueMap)
      .map((movieId) => {
        const movie = movies.find((m) => String(m.id) === movieId);
        return {
          name: movie ? movie.title : `Phim #${movieId}`, // Nếu phim bị xóa thì hiện ID
          value: movieRevenueMap[movieId],
          poster: movie?.image,
        };
      })
      .sort((a, b) => b.value - a.value) // Sắp xếp giảm dần
      .slice(0, 5); // Lấy top 5

    return chartData;
  }, [bookings, showtimes, movies]);

  // Danh sách giao dịch gần đây
  const recentTransactions = useMemo(() => {
    // Copy ra mảng mới để sort không ảnh hưởng Redux state
    return [...bookings]
      .sort((a, b) => {
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      })
      .slice(0, 5) // Lấy 5 đơn mới nhất
      .map((booking) => {
        const user = users.find((u) => String(u.id) === String(booking.user_id));
        return {
          ...booking,
          userName: user ? `${user.last_name} ${user.first_name}` : "Khách vãng lai",
        };
      });
  }, [bookings, users]);

  // Format tiền tệ
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      amount
    );

  if (bookingLoading && bookings.length === 0) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
          <p className="text-sm text-gray-500 mt-1">
            Chào mừng quay trở lại! Đây là tình hình kinh doanh hôm nay.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Doanh thu */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {formatCurrency(stats.revenue)}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-medium">+12.5%</span>
            <span className="text-gray-400 ml-1">so với tháng trước</span>
          </div>
        </div>

        {/* Card 2: Vé bán ra */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Vé đã bán</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {stats.tickets}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <Ticket className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-medium">+8.2%</span>
            <span className="text-gray-400 ml-1">so với tháng trước</span>
          </div>
        </div>

        {/* Card 3: Phim đang chiếu */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Phim đang chiếu</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {stats.moviesCount}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
              <Film className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Activity className="w-4 h-4 mr-1" />
            <span>Đang hoạt động ổn định</span>
          </div>
        </div>

        {/* Card 4: Người dùng */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Thành viên</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {stats.usersCount}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <Users className="w-4 h-4 mr-1" />
            <span>+5 mới</span>
            <span className="text-gray-400 ml-1">trong hôm nay</span>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Revenue Line Chart (Chiếm 2/3) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Biểu đồ doanh thu (7 ngày)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#6b7280', fontSize: 12}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#6b7280', fontSize: 12}}
                    tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                    formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Movies Bar Chart (Chiếm 1/3) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top phim doanh thu cao</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMoviesData} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={100} 
                        tick={{fontSize: 11}}
                    />
                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Giao dịch gần đây</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">Mã đơn</th>
                        <th className="px-6 py-4">Khách hàng</th>
                        <th className="px-6 py-4 text-center">Số ghế</th>
                        <th className="px-6 py-4 text-center">Thời gian</th>
                        <th className="px-6 py-4 text-right">Tổng tiền</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {recentTransactions.length === 0 ? (
                         <tr><td colSpan={6} className="p-6 text-center text-gray-500">Chưa có giao dịch nào</td></tr>
                    ) : (
                        recentTransactions.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-600">#{item.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{item.userName}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{item.total_seat}</span>
                                </td>
                                <td className="px-6 py-4 text-center text-gray-500">
                                    {new Date(item.created_at || "").toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-emerald-600">
                                    {formatCurrency(item.total_price_movie)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <CreditCard size={12} /> Đã thanh toán
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;