//
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Ticket, Clock, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { addToFavorites, removeFromFavorites, fetchFavorites } from '../../../store/slices/favoriteSlice';

// Interface rút gọn cho Card
export interface Movie {
  id: number;
  title: string;
  image: string;
  rating: number;
  genre: string;
  duration: string;
  age: string;
}

interface MovieCardProps {
  data: Movie;
}

const MovieCard = ({ data }: MovieCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Lấy danh sách từ favorite.items
  const favoriteItems = useSelector((state: RootState) => state.favorite.items);

  // Kiểm tra xem phim này có trong list không
  const isFavorite = favoriteItems.some((item) => Number(item.id) === Number(data.id));

  // Load danh sách lần đầu nếu rỗng
  useEffect(() => {
    if (isAuthenticated && favoriteItems.length === 0) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated, favoriteItems.length]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    // 1. Ngăn sự kiện click lan ra div cha (tránh navigate)
    e.stopPropagation(); 
    // 2. Ngăn hành vi mặc định của browser (quan trọng để tránh reload nếu button nằm trong form hoặc có type submit)
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Bạn cần đăng nhập!");
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        // Đã thích -> Gọi xóa
        await dispatch(removeFromFavorites(data.id)).unwrap();
      } else {
        // Chưa thích -> Gọi thêm
        await dispatch(addToFavorites({
          id: data.id,
          title: data.title,
          image: data.image,
          genre: data.genre,
          duration: data.duration,
          type: "2D",
          rating: data.rating,
          age: data.age
        })).unwrap();
      }
    } catch (error) {
      console.error("Lỗi cập nhật yêu thích:", error);
      // Có thể thêm toast thông báo lỗi tại đây
    }
  };

  const getAgeColor = (age: string) => {
    if (age?.includes('18')) return 'bg-red-700';
    if (age?.includes('16')) return 'bg-orange-600';
    if (age?.includes('13')) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <div 
      onClick={() => navigate(`/movie/${data.id}`)}
      className="group flex flex-col h-full cursor-pointer relative"
    >
      <div className="relative aspect-2/3 rounded-xl overflow-hidden border border-gray-800 group-hover:border-red-600 transition-all duration-300 shadow-md">
        <img 
          src={data.image} 
          alt={data.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy" 
        />
        
        <div className={`absolute top-2 left-2 ${getAgeColor(data.age)} text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-sm`}>
          {data.age || 'T13'}
        </div>

        {/* Nút Tim - Thêm type="button" để chắc chắn không phải submit form */}
        <button
          type="button" 
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-20 backdrop-blur-sm group/heart"
        >
          <Heart 
            size={20} 
            className={`transition-colors duration-300 ${
              isFavorite 
                ? "fill-red-500 text-red-500" 
                : "text-white group-hover/heart:text-red-400"
            }`} 
          />
        </button>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
          {/* Cũng thêm e.stopPropagation cho nút Mua Vé nếu cần */}
          <button 
            type="button"
            onClick={(e) => {
               e.stopPropagation();
               navigate(`/movie/${data.id}`); // Hoặc logic mua vé riêng
            }}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-600/40"
          >
              <Ticket size={16} /> Mua Vé
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className="text-white font-bold text-base md:text-lg leading-tight truncate group-hover:text-red-500 transition-colors">
          {data.title}
        </h3>
        <div className="flex flex-col gap-0.5">
          <p className="text-gray-400 text-xs truncate">{data.genre}</p>
          <div className="flex items-center text-gray-500 text-xs gap-1.5 mt-1">
              <Clock size={12} className="text-red-600" /> 
              <span>{data.duration}</span>
              {data.rating > 0 && (
                <div className="flex items-center gap-1 ml-auto text-yellow-500">
                  <Star size={12} fill="currentColor" /> 
                  <span className="font-bold">{data.rating}</span>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;