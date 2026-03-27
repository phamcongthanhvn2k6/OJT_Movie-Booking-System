import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { format, parseISO } from 'date-fns';
import type { Movie } from '../../../types/movie.type';
import type { Showtime } from '../../../types/showtime.type';

interface ShowtimeItemProps {
  movie: Movie;
  showtimes: Showtime[];
}

const ShowtimeItem: React.FC<ShowtimeItemProps> = ({ movie, showtimes }) => {
  const navigate = useNavigate(); // Hook điều hướng

  // Sắp xếp giờ chiếu
  const sortedShowtimes = [...showtimes].sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const getDisplayTime = (isoString: string) => {
    try {
        return format(parseISO(isoString), 'HH:mm');
    } catch {
        return '??:??';
    }
  };

  // --- HANDLER CHO THẺ CARD (CHA) ---
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    // THẺ CHA: Thêm onClick và cursor-pointer
    <div 
      onClick={handleCardClick}
      className="bg-[#151f30] rounded-lg p-4 flex gap-4 border border-gray-800 shadow-md transition-all group hover:border-gray-600 cursor-pointer relative"
    >
      
      {/* 1. POSTER - Không cần Link nữa vì thẻ cha đã lo */}
      <div className="w-28 h-40 shrink-0 relative rounded overflow-hidden block">
        <img 
          src={movie.image} 
          alt={movie.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
          T16
        </div>
      </div>

      {/* 2. THÔNG TIN PHIM */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 
              className="text-lg font-bold text-white uppercase truncate pr-2 group-hover:text-red-500 transition-colors duration-200" 
              title={movie.title}
            >
              {movie.title}
            </h3>

            <span className="shrink-0 border border-gray-600 text-gray-400 text-[10px] px-1 rounded h-fit mt-1">
              {movie.type || '2D'}
            </span>
          </div>
          
          <p className="text-gray-400 text-xs mb-3 truncate font-medium">{movie.genre}</p>
        </div>

        {/* 3. DANH SÁCH GIỜ CHIẾU */}
        <div>
          <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Lịch chiếu:</p>
          <div className="flex flex-wrap gap-2">
            {sortedShowtimes.map((st) => (
              <Link
                key={st.id}
                to={`/booking/${st.id}`} 
                // --- KỸ THUẬT QUAN TRỌNG: STOP PROPAGATION ---
                // Ngăn chặn sự kiện click lan ra thẻ cha (div onClick)
                onClick={(e) => e.stopPropagation()}
                className="
                  min-w-[60px] text-center px-2 py-1.5 rounded bg-[#252f40] 
                  text-gray-300 text-sm font-bold border border-transparent
                  hover:bg-red-600 hover:text-white hover:border-red-500 hover:shadow-[0_0_10px_rgba(220,38,38,0.5)]
                  transition-all duration-200 z-20 relative
                "
              >
                {getDisplayTime(st.start_time)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeItem;