/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- 1. DỮ LIỆU MẪU ---
// Lưu ý: movieId phải khớp với "id" trong file db.json (đang là chuỗi "1", "2"...)
const BANNER_DATA = [
  {
    id: 1,
    imageUrl: "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766537774/banner_pgef7v.png",
    alt: "Liên hoan phim Quốc tế Hà Nội",
    movieId: null, // null = Không click được
  },
  {
    id: 2,
    imageUrl: "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766829303/0019571_odn7rc.webp",
    alt: "Chiếm Đoạt - Phim Việt Nam",
    movieId: null, // Phim này chưa có trong db.json thì để null
  },
  {
    id: 3,
    imageUrl: "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766829301/0019589_flj5uj.webp",
    alt: "Khuyến mãi vé xem phim",
    movieId: null,
  },
  {
    id: 4,
    imageUrl: "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766829299/0019592_jooxlu.webp",
    alt: "Dune: Hành Tinh Cát 2",
    movieId: 1, // Có ID = Hiện nút xem ngay & Click được
  },
  {
    id: 5,
    imageUrl: "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766829298/0019497_d8lu9x.webp",
    alt: "Dune: Hành Tinh Cát 2 (Poster 2)",
    movieId: 1,
  },
  {
    id: 6,
    imageUrl: "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766829296/0019436_wvvw30.webp",
    alt: "Dune: Hành Tinh Cát 2 (Poster 3)",
    movieId: 1,
  },
  {
    id: 7,
    imageUrl: "https://res.cloudinary.com/dkzrqnahy/image/upload/v1766829295/0018249_jnrxfo.webp",
    alt: "Dune: Hành Tinh Cát 2 (Poster 4)",
    movieId: 1,
  },
];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // --- XỬ LÝ CLICK ---
  const handleBannerClick = (item: typeof BANNER_DATA[0]) => {
    // Chỉ điều hướng nếu có movieId
    if (item.movieId) {
      navigate(`/movie/${item.movieId}`);
    }
  };

  // --- LOGIC TỰ ĐỘNG CHUYỂN SLIDE ---
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000); 
    return () => clearInterval(slideInterval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === BANNER_DATA.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? BANNER_DATA.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="w-full h-56 md:h-80 lg:h-[600px] relative group bg-gray-900 overflow-hidden">
      
      {/* Container chứa các ảnh */}
      {BANNER_DATA.map((slide, index) => (
        <div
          key={slide.id}
          // Chỉ gắn sự kiện click nếu có movieId
          onClick={() => slide.movieId && handleBannerClick(slide)}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out group/slide ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          } ${slide.movieId ? 'cursor-pointer' : 'cursor-default'}`} // Chỉnh con trỏ chuột
        >
          {/* Ảnh Background */}
          <img 
            src={slide.imageUrl} 
            alt={slide.alt} 
            className="w-full h-full object-cover object-center"
          />
          
          {/* Lớp phủ gradient đen */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-gray-950 to-transparent pointer-events-none"></div>

          {/* --- NÚT XEM NGAY (Chỉ hiện khi là Phim và đang Hover) --- */}
          {slide.movieId && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300">
                <button className="bg-red-600/90 text-white px-8 py-3 rounded-full font-bold text-lg uppercase tracking-wider flex items-center gap-3 transform translate-y-4 group-hover/slide:translate-y-0 transition-transform duration-300 shadow-lg border-2 border-red-500 hover:bg-red-700 hover:scale-105">
                    <PlayCircle size={28} />
                    Xem Chi Tiết
                </button>
            </div>
          )}
        </div>
      ))}

      {/* --- NÚT ĐIỀU HƯỚNG --- */}
      <button 
        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 left-5 text-2xl rounded-full p-3 bg-black/30 hover:bg-red-600/80 text-white cursor-pointer z-20 transition-all backdrop-blur-sm"
      >
        <ChevronLeft size={32} />
      </button>

      <button 
        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
        className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 right-5 text-2xl rounded-full p-3 bg-black/30 hover:bg-red-600/80 text-white cursor-pointer z-20 transition-all backdrop-blur-sm"
      >
        <ChevronRight size={32} />
      </button>

      {/* --- DOTS INDICATORS --- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {BANNER_DATA.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={(e) => { e.stopPropagation(); goToSlide(slideIndex); }}
            className={`cursor-pointer transition-all duration-300 rounded-full h-2 md:h-2.5 ${
              currentIndex === slideIndex 
                ? 'bg-red-600 w-8 md:w-10 shadow-[0_0_10px_red]' 
                : 'bg-white/50 w-2 md:w-2.5 hover:bg-white'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;