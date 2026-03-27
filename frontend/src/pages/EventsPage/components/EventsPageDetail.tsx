import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // [MỚI]: Import hook router
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import './EventsPageDetail.css';

import { fetchEvents } from '../../../store/slices/event.slice';
import type { AppDispatch, RootState } from '../../../store';

// Interface EventDetail (Giữ nguyên)
interface EventDetail {
  id: string;
  title: string;
  description: string;
  detailTittle?: string;
  thumbnail: string;
  date: string;
  bannerUrl?: string;
  posterUrl?: string;
  venues?: string;
  website?: string;
  note?: string;
}

// Không cần Props eventId nữa, hoặc để optional nếu muốn tái sử dụng


const EventsPageDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // [MỚI]: Dùng để quay lại
  const { id } = useParams<{ id: string }>(); // [MỚI]: Lấy ID từ URL (ví dụ: /events/123)

  const { list: events, loading } = useSelector(
    (state: RootState) => state.events as { list: EventDetail[]; loading: boolean }
  );

  // Tìm event dựa trên ID từ URL
  const event = useMemo(() => {
    return events.find((item) => String(item.id) === String(id));
  }, [events, id]);

  useEffect(() => {
    // Nếu list rỗng (reload trang), fetch lại dữ liệu
    if (events.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, events.length]);

  const detailParagraphs = useMemo(() => {
    if (!event?.detailTittle) return [];
    return event.detailTittle
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean);
  }, [event]);

  // Hàm xử lý quay lại
  const handleBack = () => {
    navigate('/lien-hoan-phim'); // [MỚI]: Điều hướng về trang danh sách
  };

  if (loading && !event) {
    return (
      <>
        <Header />
        <div className="container" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="text-white text-xl">Đang tải chi tiết sự kiện...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="notFound">
            <h2 className="notFoundTitle">Không tìm thấy sự kiện</h2>
            <button onClick={handleBack} className="backButton">
                ← Quay lại
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="container">
        <div className="backButtonContainer">
            {/* Sử dụng handleBack thay vì onBack từ props */}
            <button onClick={handleBack} className="backButtonTop">
              ← Quay lại
            </button>
        </div>

        {/* ... (Phần hiển thị nội dung bên dưới giữ nguyên) ... */}
        {/* ===== HEADER DETAIL ===== */}
        <section className="header">
          <h1 className="title">{event.title}</h1>

          {detailParagraphs.length > 0 && (
            <div className="description">
              {detailParagraphs.map((p, i) => (
                <p key={i} className="paragraph">
                  {p}
                </p>
              ))}
            </div>
          )}

          {event.venues && (
            <p className="venueItem">
              <strong>Địa điểm:</strong> {event.venues}
            </p>
          )}

          {event.website && (
            <p className="websiteLink">
              Website:{' '}
              <a href={event.website} target="_blank" rel="noreferrer">
                {event.website}
              </a>
            </p>
          )}

          {event.note && (
            <p className="note text-gray-400 italic mt-2">
              * {event.note}
            </p>
          )}
        </section>

        {/* ===== BANNER / POSTER ===== */}
        <section className="bannerSection">
          <div className="bannerContainer">
            {event.bannerUrl && (
              <img
                src={event.bannerUrl}
                alt={`${event.title} Banner`}
                className="bannerImg"
              />
            )}
          </div>

          <div className="bannerContainer2">
            {event.posterUrl && (
              <img
                src={event.posterUrl}
                alt={`${event.title} Poster`}
                className="posterImg"
              />
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default EventsPageDetail;