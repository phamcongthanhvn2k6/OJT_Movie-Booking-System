/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { fetchNews } from '../../../store/slices/news.slices';
import { fetchEvents } from '../../../store/slices/event.slice';

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 1. Lấy dữ liệu từ Redux Store
  const { list: newsList } = useSelector((state: RootState) => state.news);
  const { list: eventList } = useSelector((state: RootState) => state.events);

  // 2. Gọi API lấy dữ liệu khi component render (nếu chưa có ở Home)
  useEffect(() => {
    dispatch(fetchNews());
    dispatch(fetchEvents());
  }, [dispatch]);

  // 3. Phân loại dữ liệu để hiển thị
  // Giả sử: Lấy 2 tin tức đầu làm "Khuyến mãi" (hoặc bạn có thể lọc theo category nếu DB có)
  const promotions = newsList.slice(0, 2); 
  
  // Lấy 4 sự kiện đầu tiên
  const events = eventList.slice(0, 4); 

  // Lấy tin tức thứ 3 và 4 để làm Banner dọc (Big Promo)
  const bigBanners = newsList.slice(2, 4);

  return (
    <aside className="w-full flex flex-col gap-10">
      
      {/* --- PHẦN 1: KHUYẾN MÃI (Lấy từ News) --- */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white tracking-tight">Tin tức & Khuyến mãi</h3>
          <Link to="/tin-tuc" className="text-xs text-gray-400 hover:text-white hover:underline transition-all">
            Xem tất cả
          </Link>
        </div>
        
        <div className="space-y-4">
          {/* Render danh sách khuyến mãi từ DB */}
          {promotions.map((item: any) => (
             <div 
                key={item.id}
                onClick={() => navigate(`/news/${item.id}`)} // Chuyển trang chi tiết tin tức
                className="relative rounded-lg overflow-hidden border border-gray-800 aspect-video group cursor-pointer"
             >
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={item.title}
                />
                {/* Overlay Tiêu đề khi hover (Tùy chọn) */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-xs font-bold line-clamp-2">{item.title}</p>
                </div>
             </div>
          ))}

          {promotions.length === 0 && (
             <div className="text-gray-500 text-sm">Đang cập nhật khuyến mãi...</div>
          )}
        </div>
      </section>

      {/* --- PHẦN 2: SỰ KIỆN (Lấy từ Events) --- */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white tracking-tight">Sự kiện</h3>
          <Link to="/lien-hoan-phim" className="text-xs text-gray-400 hover:text-white hover:underline transition-all">
            Xem tất cả
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {events.map((event: any) => (
            <div 
                key={event.id} 
                onClick={() => navigate(`/events/${event.id}`)} // Chuyển trang chi tiết sự kiện
                className="rounded-lg overflow-hidden border border-gray-800 aspect-video group cursor-pointer relative"
            >
              <img 
                src={event.thumbnail || event.bannerUrl} // Ưu tiên thumbnail
                className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                alt={event.title}
              />
               <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent flex items-end p-3">
                  <p className="text-white text-xs font-bold line-clamp-2 group-hover:text-red-500 transition-colors">
                      {event.title}
                  </p>
               </div>
            </div>
          ))}
          
          {events.length === 0 && (
             <div className="text-gray-500 text-sm">Đang cập nhật sự kiện...</div>
          )}
        </div>
      </section>

      {/* --- PHẦN 3: CÁC BANNER DỌC (BIG BANNERS - Lấy từ News hoặc hardcode ID) --- */}
      <section className="flex flex-col gap-4">
         {/* Banner 1: Link tới tin tức ID cụ thể (Ví dụ ID 8 trong db.json) */}
         {/* Nếu trong DB bạn có ID 8 là "Kẻ trộm mặt trăng", nó sẽ link tới đó */}
         <div 
            onClick={() => navigate(`/news/8`)} 
            className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-lg shadow-orange-900/10 group"
         >
          <img 
            src="https://res.cloudinary.com/dkzrqnahy/image/upload/v1766537780/sukien3_vomucs.png"
            alt="Big Promo 1"
            className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = "https://cdn.galaxycine.vn/media/2024/03/15/45k-hssv-digital-2048x682_1710488880625.jpg" }}
          />
        </div>

        {/* Banner 2: Link tới tin tức ID 2 (Vui Tết Trung Thu) */}
        <div 
            onClick={() => navigate(`/news/2`)}
            className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
        >
          <img 
            src="https://res.cloudinary.com/dyj2auia8/image/upload/v1766623099/pic2_pr8php.png" 
            alt="Big Promo 2"
            className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

    </aside>
  );
};

export default Sidebar;