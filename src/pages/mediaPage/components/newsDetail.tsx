import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import './newsDetail.css';

interface NewsDetailType {
  id: string;
  title: string;
  date: string;
  lead: string;
  content: string;
  details: string[];
  image: string;
  detailImage?: string;
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  

  // 1. Lấy dữ liệu Local Storage bằng useMemo
  const localNews = useMemo(() => {
    if (!id) return null;
    try {
      const stored = localStorage.getItem('localNews');
      const localNewsList: NewsDetailType[] = stored ? JSON.parse(stored) : [];
      return localNewsList.find((n) => n.id === id) || null;
    } catch (error) {
      console.error("Error reading local news:", error);
      return null;
    }
  }, [id]);

  // State lưu trữ dữ liệu từ API
  const [apiNews, setApiNews] = useState<NewsDetailType | null>(null);
  
  // State để theo dõi việc fetch API có lỗi hay không (để hiển thị Not Found)
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    // Nếu không có ID hoặc đã tìm thấy trong Local Storage thì không cần gọi API
    if (!id || localNews) return;

    let isMounted = true;
    
    // Reset lỗi khi bắt đầu fetch mới
    setFetchError(false);

    const fetchNews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/News/${id}`);
        if (!res.ok) throw new Error('Not found');
        
        const data = await res.json();
        if (isMounted) {
          setApiNews(data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setApiNews(null);
          setFetchError(true);
        }
      }
    };

    fetchNews();

    return () => { isMounted = false; };
  }, [id, localNews]);

  // 2. Logic xác định bài viết cuối cùng
  // Ưu tiên Local, sau đó đến API
  const finalNews = localNews || apiNews;

  // 3. Derived State cho Loading:
  // Đang tải khi: Không có Local News VÀ (Chưa có API News hoặc API News ID khác ID hiện tại) VÀ Chưa báo lỗi
  // Cách này giúp bỏ qua việc setApiNews(null) và setLoading(true) trong useEffect -> Fix lỗi ESLint
  const isApiLoading = !localNews && !fetchError && (!apiNews || apiNews.id !== id);

  if (isApiLoading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '100px 0' }}>Đang tải...</div>;
  }

  // Nếu đã tải xong mà vẫn không có dữ liệu (cả Local lẫn API)
  if (!finalNews) {
     return <div style={{ color: 'white', textAlign: 'center', padding: '100px 0' }}>Không tìm thấy bài viết</div>;
  }

  return (
    <>
      <Header />
      <main className="news-detail-page">
        <article className="news-detail-container">
          <button onClick={() => navigate('/media')} className="back-button">
            <ArrowLeft size={20} />
            <span>Quay lại tin tức</span>
          </button>

          <h1 className="news-title">{finalNews.title}</h1>
          <p className="news-date">{finalNews.date}</p>
          <p className="news-lead">{finalNews.lead}</p>
          <p className="news-paragraph">{finalNews.content}</p>

          {finalNews.details && finalNews.details.length > 0 && (
            <ol className="news-info-list">
              {finalNews.details.map((detail, index) => {
                const parts = detail.split(':');
                const label = parts[0];
                const value = parts.slice(1).join(':');
                return (
                  <li key={index}>
                    {value ? <><strong>{label}:</strong>{value}</> : detail}
                  </li>
                );
              })}
            </ol>
          )}

          <div className="news-image-wrapper">
            <img src={finalNews.detailImage || finalNews.image} alt={finalNews.title} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default NewsDetail;