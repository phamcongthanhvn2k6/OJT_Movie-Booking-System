import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useState, useRef, type UIEvent } from 'react';
import MovieCard, { type Movie } from './MovieCard';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
}

const MovieSection = ({ title, movies }: MovieSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- BƯỚC 1: LỚP BẢO VỆ (SAFETY GUARD) ---
  // Nếu HomePage quên truyền movies hoặc movies bị lỗi, 
  // dòng này giúp trang web không bị crash trắng xóa.
  if (!movies || movies.length === 0) {
    return (
      <div className="w-full text-center py-10 text-gray-500">
        Đang tải dữ liệu phim...
      </div>
    );
  }

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768) return;

    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const centerPoint = scrollLeft + containerWidth / 2;

    const children = container.children;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(centerPoint - childCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    setActiveIndex(closestIndex);
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-2 px-4 md:px-0">
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-red-600 rounded-sm"></div>
            <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
                {title}
            </h2>
        </div>
        <Link to="/movies" className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors group">
            Xem tất cả 
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Container cuộn ngang */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto pb-12 pt-4 gap-2 scrollbar-hide px-[25%] snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8 md:overflow-visible md:px-0 md:pb-0 md:pt-0"
      >
        {movies.map((movie, index) => (
          <div 
            // --- BƯỚC 2: DÙNG MOVIE.ID LÀM KEY ---
            // Tránh lỗi "Duplicate Keys" đã báo ở Console giúp React chạy mượt hơn
            key={movie.id} 
            className={`
              shrink-0 w-60 snap-center transition-all duration-500 ease-out
              ${activeIndex === index 
                ? 'scale-110 z-20 opacity-100 brightness-100' 
                : 'scale-95 z-10 opacity-80 brightness-75'
              }
              md:w-auto md:shrink md:scale-100 md:opacity-100 md:z-auto md:brightness-100
            `}
          >
            <MovieCard data={movie} />
            
            {/* Tên phim hiển thị trên Mobile khi ở giữa */}
            <div className={`mt-4 text-center transition-opacity duration-500 md:hidden ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-white font-bold text-sm truncate uppercase">{movie.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSection;