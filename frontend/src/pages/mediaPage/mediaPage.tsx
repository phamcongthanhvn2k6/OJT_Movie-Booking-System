import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight} from 'lucide-react'; 
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AddNewsForm from './components/AddNewsForm'; 
import './mediaPage.css';

import { fetchNews } from '../../store/slices/news.slices';
import type { AppDispatch, RootState } from '../../store';

interface NewsPost {
  id: string;
  title: string;
  image: string;
  date: string;
  lead?: string;
}

const POSTS_PER_PAGE = 8;

const PostCard: React.FC<{ post: NewsPost }> = ({ post }) => {
   const navigate = useNavigate();
   return (
    <div className="post-card" onClick={() => navigate(`/news/${post.id}`)}>
      <div className="post-card__image-wrapper">
        <img src={post.image} alt={post.title} className="post-card__image" />
      </div>
      <div className="post-card__content">
        <div className="post-card__date">
          <Calendar size={14} />
          <span>{post.date}</span>
        </div>
        <h3 className="post-card__title">{post.title}</h3>
      </div>
    </div>
  );
};

// Pagination (Giữ nguyên)
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination">
    <button
      className="pagination__button"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <ChevronLeft size={20} />
      <span>Quay lại</span>
    </button>
    
    <div className="pagination__info">
      <span className="pagination__current">{currentPage}</span>
      <span>/</span>
      <span className="pagination__total">{totalPages}</span>
    </div>

    <button
      className="pagination__button"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <span>Tiếp theo</span>
      <ChevronRight size={20} />
    </button>
  </div>
);

const MediaPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: apiNews, loading } = useSelector((state: RootState) => state.news as { list: NewsPost[], loading: boolean });
  
  // SỬA LỖI: Dùng Lazy Initialization để lấy dữ liệu ngay khi khởi tạo state
  // Không gọi setLocalNews trong useEffect nữa
  const [localNews, setLocalNews] = useState<NewsPost[]>(() => {
    try {
      const stored = localStorage.getItem('localNews');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading local news:", error);
      return [];
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  
  // Hàm làm mới lại dữ liệu local khi quay lại từ form thêm mới (nếu cần)
  const refreshLocalNews = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('localNews') || '[]');
      setLocalNews(stored);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(fetchNews());
    // Đã bỏ setLocalNews ở đây
  }, [dispatch]);

  // [MỚI] Gộp danh sách: Local News + API News
  const allNews = [...localNews, ...apiNews];

  const totalPages = Math.ceil(allNews.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  // Slice từ danh sách gộp
  const currentPosts = allNews.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isCreating) {
    return (
        <>
            <Header />
            <div className="media-page" style={{minHeight: '80vh'}}>
                <div className="media-page__container">
                    <button 
                        onClick={() => setIsCreating(false)} 
                        className="mb-4 flex items-center gap-2 text-white hover:text-blue-400"
                    >
                        <ChevronLeft size={20} /> Quay lại danh sách
                    </button>
                    
                    <AddNewsForm 
                        onSuccess={() => {
                            setIsCreating(false);
                            refreshLocalNews(); // Cập nhật lại list khi thêm thành công
                        }}
                        onCancel={() => setIsCreating(false)}
                    />
                </div>
            </div>
            <Footer />
        </>
    )
  }

  return (
    <>
      <Header />
      <div className="media-page">
        <div className="media-page__container">
          <div className="media-page__header">
            <div>
                <h1 className="media-page__title">Tin tức</h1>
                <p className="media-page__subtitle">Cập nhật thông tin mới nhất từ NCC Cinema</p>
            </div>
          </div>

          {loading ? (
            <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Đang tải tin tức...</div>
          ) : (
            <div className="posts-grid">
              {currentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
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
};

export default MediaPage;