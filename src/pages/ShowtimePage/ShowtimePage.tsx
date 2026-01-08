import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isSameDay, parseISO } from 'date-fns';

// 1. Import Types & Redux Actions
import type { AppDispatch, RootState } from '../../store';
import { fetchMovies } from '../../store/slices/movie.slices';
import { fetchShowtimes } from '../../store/slices/showtime.slices';

// 2. Import Components con
import DateSelector from './components/DateSelector';
import ShowtimeItem from './components/ShowtimeItem';

// 3. Import Header & Footer (⚠️ Bạn hãy kiểm tra đúng đường dẫn file của bạn)
// Ví dụ: Nếu Header nằm ở src/components/Header/index.tsx
import Header from '../../components/Header'; 
import Footer from '../../components/Footer';

const ShowtimePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  // --- STATE & DATA ---
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const { list: movies, loading: loadingMovies } = useSelector((state: RootState) => state.movie);
  const { list: showtimes, loading: loadingShowtimes } = useSelector((state: RootState) => state.showtime);

  // --- API CALL ---
  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchShowtimes()); 
  }, [dispatch]);

  // --- LOGIC GHÉP DỮ LIỆU ---
  const showtimeData = useMemo(() => {
    if (!movies.length || !showtimes.length) return [];

    // B1: Lọc showtime theo ngày
    const filteredShowtimes = showtimes.filter((st) => {
        try {
            return isSameDay(parseISO(st.start_time), parseISO(selectedDate));
        } catch (e) {
            console.error(e);
            return false; 
        }
    });

    // B2: Map showtime vào movie
    const result = movies.map((movie) => {
      const movieTimes = filteredShowtimes.filter((st) => String(st.movie_id) === String(movie.id));
      return { movie, showtimes: movieTimes };
    });

    // B3: Chỉ lấy phim có lịch chiếu
    return result.filter(item => item.showtimes.length > 0);
  }, [movies, showtimes, selectedDate]);

  const isLoading = loadingMovies || loadingShowtimes;

  // --- RENDER UI ---
  return (
    // Container chính: flex-col để xếp dọc Header -> Main -> Footer
    <div className="flex flex-col min-h-screen bg-[#020d18] text-white">
      
      {/* 1. HEADER */}
      <Header />

      {/* 2. MAIN CONTENT */}
      {/* flex-grow giúp phần này chiếm hết khoảng trống, đẩy Footer xuống đáy */}
      <main className="grow py-10 px-4 md:px-20">
        
        {/* Title */}
        <div className="flex items-center gap-2 mb-8 border-l-4 border-red-600 pl-4">
          <h1 className="text-2xl font-bold uppercase tracking-wide">Lịch Chiếu Phim</h1>
        </div>

        {/* Chọn ngày */}
        <DateSelector 
          selectedDate={selectedDate} 
          onChange={(date) => setSelectedDate(date)} 
        />

        {/* Note */}
        <div className="text-center text-orange-400 text-sm mb-8 italic">
          * Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h00 và khán giả dưới 16 tuổi kết thúc trước 23h00.
        </div>

        {/* Danh sách phim */}
        {isLoading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {showtimeData.length > 0 ? (
              showtimeData.map((item) => (
                <ShowtimeItem 
                  key={item.movie.id} 
                  movie={item.movie} 
                  showtimes={item.showtimes} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16 border border-dashed border-gray-800 rounded-xl bg-[#0f172a]">
                <p className="text-gray-400 text-lg">Không có suất chiếu nào vào ngày này.</p>
                <p className="text-gray-600 text-sm mt-2">Hãy thử chọn ngày khác nhé!</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. FOOTER */}
      <Footer />
    </div>
  );
};

export default ShowtimePage;