/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
// --- THÊM: Import action clearCurrentMovie để xóa data cũ ---
import {
  fetchMovieDetail,
  clearCurrentMovie,
} from "../../store/slices/movie.slices";
import { fetchShowtimes } from "../../store/slices/showtime.slices";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import type { Showtime } from "../../types/showtime.type";
import { Banner } from "./components/Banner";
import { ShowTimeList } from "./components/ShowTimeList";
import BookingPage from "./components/BookingPage";
import Trailer from "./components/Trailer";

export const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null
  );
  const [isOpenTrailer, setIsOpenTrailer] = useState<boolean>(false);

  // Lấy dữ liệu từ Redux Store
  const { currentMovie, loading: movieLoading } = useSelector(
    (state: RootState) => state.movie
  );
  const { list: showtimeList, loading: showtimeLoading } = useSelector(
    (state: RootState) => state.showtime
  );

  // Gọi API lấy Chi tiết phim & Lịch chiếu khi ID thay đổi
  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const movieId = id;

      // --- FIX QUAN TRỌNG: Reset phim cũ trước khi tải phim mới ---
      // Giúp UI hiển thị Loading ngay lập tức thay vì hiện thông tin phim cũ
      dispatch(clearCurrentMovie());

      dispatch(fetchMovieDetail(movieId));
      dispatch(fetchShowtimes({ movieId: movieId }));

      // Reset suất chiếu đang chọn khi chuyển phim khác
      setSelectedShowtime(null);
    }
  }, [id, dispatch]);

  // Xử lý dữ liệu Lịch chiếu
  // --- FIX QUAN TRỌNG: Giữ nguyên start_time là STRING ---
  const formattedShowtimes = useMemo(() => {
    return (
      showtimeList
        .filter((st) => String(st.movie_id) === String(id)) // So sánh chuỗi cho an toàn
        // Chỉ convert sang Date để SẮP XẾP tăng dần
        .sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        )
    );
  }, [showtimeList, id]);

  // Hiệu ứng Loading
  if (movieLoading || !currentMovie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  // Render giao diện
  return (
    <div className="bg-gray-900 text-white min-h-screen w-full">
      <Header />
      <div className="w-full mx-auto">
        <main className="w-full font-[Montserrat]">
          {/* Banner phim động */}
          <Banner currentMovie={currentMovie} openTrailer={()=>setIsOpenTrailer(true)}/>

          <div className="w-full">
            {showtimeLoading ? (
              <div className="text-center py-10 text-gray-400">
                Đang cập nhật lịch chiếu...
              </div>
            ) : formattedShowtimes.length > 0 ? (
              //Danh sách suất chiếu
              <ShowTimeList
                showtimes={formattedShowtimes}
                onSelectShowtime={(st) => setSelectedShowtime(st)}
                selectedShowtime={selectedShowtime}
              />
            ) : (
              <div className="text-center py-10 text-yellow-500 text-lg border border-yellow-500/30 rounded-lg bg-yellow-500/5 mx-4">
                Hiện chưa có lịch chiếu cho phim này. Vui lòng quay lại sau!
              </div>
            )}
          </div>

          {/* Khu vực chọn ghế (Booking) */}
          <div className="w-full lg:max-w-4xl md:max-w-180 max-w-89.5 mx-auto px-4 pb-12">
            {selectedShowtime && <BookingPage showtime={selectedShowtime} />}
          </div>

          {/* trailer modal */}
          {isOpenTrailer ? (
            <Trailer
              trailerLink={currentMovie.trailer}
              onClose={() => setIsOpenTrailer(false)}
            />
          ) : (
            <div />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};
