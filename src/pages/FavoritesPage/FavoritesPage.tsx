/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Store & Components
import type { AppDispatch, RootState } from '../../store';
import { fetchFavorites } from '../../store/slices/favoriteSlice';
import FavoriteItem from './components/FavoriteItem';
import Header from '../../components/Header'; 
import Footer from '../../components/Footer'; 

const FavoritesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Lấy dữ liệu từ Store
  const { items: favorites, status } = useSelector((state: RootState) => state.favorite);
  const { user } = useSelector((state: RootState) => state.auth);

  // Đảm bảo dữ liệu luôn mới nhất khi vào trang
  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);

  const isLoading = status === 'loading';

  return (
    <div className="flex flex-col min-h-screen bg-[#020d18] text-white">
      <Header />

      <main className="grow py-10 px-4 md:px-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Tiêu đề trang */}
          <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
            <div className="bg-red-600 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide">Phim Yêu Thích</h1>
              <p className="text-gray-400 text-sm mt-1">
                Danh sách các bộ phim bạn đang quan tâm
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && favorites.length === 0 && (
            <div className="text-center py-20 bg-[#151f30] rounded-xl border border-dashed border-gray-700">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">Chưa có phim yêu thích</h3>
              <p className="text-gray-500 mb-6">Hãy khám phá các bộ phim mới và thêm vào danh sách nhé!</p>
              <Link 
                to="/" 
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                Khám phá ngay
              </Link>
            </div>
          )}

          {/* Render List */}
          {!isLoading && favorites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {favorites.map((movie, index) => {
                 // --- FIX: Kiểm tra dữ liệu an toàn ---
                 // Nếu dữ liệu bị lỗi (null, không có id, hoặc là số 1 như trong db.json cũ), ta bỏ qua không render
                 if (!movie || typeof movie !== 'object' || !movie.id) return null;

                 return (
                   <FavoriteItem key={movie.id} movie={movie} />
                 );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;