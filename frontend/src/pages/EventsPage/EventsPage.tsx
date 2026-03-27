import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './EventsPage.css';

import { fetchEvents } from '../../store/slices/event.slice';
import type { AppDispatch, RootState } from '../../store';

interface Event {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  detailTittle?: string;
  venues?: string;
  bannerUrl?: string;
  posterUrl?: string;
  website?: string;
}

const POSTS_PER_PAGE = 10;

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-center gap-4 mt-8 py-4">
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${currentPage === 1 
          ? 'text-gray-600 cursor-not-allowed bg-white/5' 
          : 'text-white bg-white/10 hover:bg-white/20'}`}
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <ChevronLeft size={18} />
      <span>Trước</span>
    </button>
    <div className="flex items-center gap-2 text-white font-medium">
      <span className="text-blue-400">{currentPage}</span>
      <span className="text-gray-500">/</span>
      <span>{totalPages}</span>
    </div>
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${currentPage === totalPages 
          ? 'text-gray-600 cursor-not-allowed bg-white/5' 
          : 'text-white bg-white/10 hover:bg-white/20'}`}
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <span>Tiếp</span>
      <ChevronRight size={18} />
    </button>
  </div>
);

const EventItem: React.FC<{ event: Event; onClick: () => void }> = ({ event, onClick }) => (
  <div
    className="group cursor-pointer transition-colors duration-200 hover:bg-[#131B2E] rounded-md p-4 -mx-4"
    onClick={onClick}
  >
    <div className="flex gap-4">
      <img src={event.thumbnail} alt={event.title} className="w-22.5 h-30 md:w-30 md:h-40 object-cover rounded shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm md:text-base leading-tight mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {event.title}
          </h3>
          <p className="text-[#B0B7C3] text-xs md:text-sm leading-relaxed line-clamp-3">
            {event.description}
          </p>
        </div>
        <div className="mt-2 md:mt-0 md:shrink-0">
          <span className="text-[#8A93A3] text-xs md:text-sm bg-white/5 px-2 py-1 rounded">
            {event.date}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default function FilmFestivalEvents() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list: events, loading } = useSelector((state: RootState) => state.events as { list: Event[], loading: boolean });
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const totalPages = Math.ceil(events.length / POSTS_PER_PAGE);
  
  const currentEvents = useMemo(() => {
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    return events.slice(indexOfFirstPost, indexOfLastPost);
  }, [currentPage, events]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const listElement = document.getElementById('event-list-top');
      if (listElement) listElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEventClick = (id: string) => {
    navigate(`/events/${id}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0B1220]">
        <div className="hero-banner">
          <img src="/eventpic.png" alt="Banner" className="w-full object-cover" />
          {/* ĐÃ XÓA NÚT "THÊM SỰ KIỆN" Ở ĐÂY */}
        </div>

        <div id="event-list-top" className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {loading ? (
             <div className="text-white text-center py-10">Đang tải sự kiện...</div>
          ) : (
            <div className="space-y-1">
              {currentEvents.length > 0 ? (
                currentEvents.map((event, index) => (
                  <React.Fragment key={event.id}>
                    <EventItem event={event} onClick={() => handleEventClick(event.id)} />
                    {index < currentEvents.length - 1 && <hr className="border-0 h-px bg-white/10 my-1" />}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center text-gray-400">Không có sự kiện nào.</div>
              )}
            </div>
          )}
          
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}