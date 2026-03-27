/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { fetchMovies } from '../../store/slices/movie.slices';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BannerSlider from './components/BannerSlider';
import MovieSection from './components/MovieSection';
import Sidebar from './components/Sidebar';

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 1. Lấy danh sách phim từ Redux (nguồn: db.json)
  const { list: movieList, loading } = useSelector((state: RootState) => state.movie);

  // 2. Gọi API fetchMovies khi trang vừa tải
  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // 3. XỬ LÝ DỮ LIỆU TỪ DB.JSON (Mapping)
  const formattedMovies = useMemo(() => {
    return movieList.map((movie: any) => ({
      // Chuyển đổi ID từ chuỗi "1" sang số 1
      id: Number(movie.id), 
      
      title: movie.title,
      
      image: movie.image, 
      
      // db.json trả về số (166), giao diện cần chuỗi "166 phút"
      duration: movie.duration ? `${movie.duration} phút` : "Đang cập nhật",
      
      genre: movie.genre || "Phim chiếu rạp",
      
      // Các trường db.json chưa có, ta gán mặc định để giao diện đẹp
      rating: 8.5, 
      age: "T13"
    }));
  }, [movieList]);

  // 4. Chia danh sách phim: 
  // Lấy một nửa đầu làm "Phim Đang Chiếu", nửa sau làm "Phim Sắp Chiếu"
  const midPoint = Math.ceil(formattedMovies.length / 2);
  const nowShowingMovies = formattedMovies.slice(0, midPoint);
  const comingSoonMovies = formattedMovies.slice(midPoint);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="grow ">
        <section className="w-full">
           <BannerSlider />
        </section>

        <div className="container mx-auto px-40 ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- CỘT TRÁI: DANH SÁCH PHIM --- */}
                <div className="lg:col-span-9 space-y-16 mt-10">
                    {loading ? (
                      <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-400">Đang tải phim từ Server...</p>
                      </div>
                    ) : (
                      <>
                        {formattedMovies.length > 0 ? (
                          <>
                            <MovieSection 
                              title="Phim Đang Chiếu" 
                              movies={nowShowingMovies} 
                            />
                            
                            <MovieSection 
                              title="Phim Sắp Chiếu" 
                              movies={comingSoonMovies} 
                            />
                          </>
                        ) : (
                          <div className="text-center text-gray-500 py-10">
                            Không có dữ liệu. Vui lòng kiểm tra lại json-server.
                          </div>
                        )}
                      </>
                    )}
                </div>

                {/* --- CỘT PHẢI: SIDEBAR --- */}
                <div className="lg:col-span-3 mt-12 lg:mt-10">
                    <Sidebar />
                </div>

            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;