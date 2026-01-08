import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Trash2, Clock } from 'lucide-react';
import { type Movie, removeFromFavorites } from '../../../store/slices/favoriteSlice';
import type { AppDispatch } from '../../../store';

interface FavoriteItemProps {
  movie: Movie;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ movie }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Xử lý click vào thẻ Card
  const handleCardClick = () => {
    if (movie && movie.id) {
      console.log("Navigating to movie:", movie.id); // Debug: Kiểm tra xem có log này khi click không
      navigate(`/movie/${movie.id}`);
    } else {
      console.error("Lỗi: Không tìm thấy ID phim");
    }
  };

  // Xử lý nút Xóa (Quan trọng: e.stopPropagation)
  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔴 Chặn sự kiện click lan ra thẻ cha (div) để không bị chuyển trang
    
    if (window.confirm(`Xóa "${movie.title}" khỏi danh sách?`)) {
      await dispatch(removeFromFavorites(movie.id));
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-[#151f30] rounded-lg p-4 flex gap-4 border border-gray-800 shadow-md group hover:border-red-600/50 cursor-pointer relative transition-all duration-300 hover:-translate-y-1"
    >
      {/* POSTER */}
      <div className="w-24 h-36 shrink-0 relative rounded overflow-hidden">
        <img 
          src={movie.image || 'https://via.placeholder.com/150'} 
          alt={movie.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h3 className="text-lg font-bold text-white uppercase line-clamp-2 pr-8 group-hover:text-red-500 transition-colors">
            {movie.title}
          </h3>
          
          <div className="mt-2 space-y-1.5">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              {movie.duration || 'Đang cập nhật'}
            </p>
          </div>
        </div>

        {/* Nút Xóa */}
        <div className="flex justify-end mt-2">
           <button
            onClick={handleRemove}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-xs font-bold uppercase tracking-wider z-20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Bỏ thích
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItem;