import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Edit, Eye, Search, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchNews } from '../../store/slices/news.slices';
import type { AppDispatch, RootState } from '../../store';
import AddNewsForm from '../mediaPage/components/AddNewsForm';

const POSTS_PER_PAGE = 8;

interface NewsPost {
  id: string;
  title: string;
  image: string;
  date: string;
  lead?: string;
  content?: string;
  details?: string[];
  detailImage?: string;
}

const NewsManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: apiNews, loading } = useSelector(
    (state: RootState) => state.news as { list: NewsPost[], loading: boolean }
  );

  // Lazy Initialization: Lấy dữ liệu ngay khi khởi tạo state
  const [localNews, setLocalNews] = useState<NewsPost[]>(() => {
    try {
      const stored = localStorage.getItem('localNews');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading local news:", error);
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsPost | null>(null);
  const [viewingNews, setViewingNews] = useState<NewsPost | null>(null);

  // Hàm này dùng để reload lại local news khi có thay đổi
  const refreshLocalNews = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('localNews') || '[]');
      setLocalNews(stored);
    } catch (error) {
      // SỬA LỖI: Sử dụng biến error để log ra console thay vì bỏ trống
      console.error("Failed to refresh local news:", error);
      setLocalNews([]);
    }
  };

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  // Gộp danh sách: Local News lên đầu, API News phía sau
  const combinedNewsList = [...localNews, ...apiNews];

  // Filter logic
  const filteredNews = combinedNewsList.filter(news => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    const titleMatch = news.title.toLowerCase().includes(search);
    const leadMatch = news.lead?.toLowerCase().includes(search);
    const contentMatch = news.content?.toLowerCase().includes(search);
    return titleMatch || leadMatch || contentMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / POSTS_PER_PAGE);
  const validCurrentPage = currentPage > totalPages && totalPages > 0 ? 1 : currentPage;
  const startIndex = (validCurrentPage - 1) * POSTS_PER_PAGE;
  const currentNews = filteredNews.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCreateNew = () => {
    setEditingNews(null);
    setViewingNews(null);
    setIsFormOpen(true);
  };

  const handleEdit = (news: NewsPost) => {
    setEditingNews(news);
    setViewingNews(null);
    setIsFormOpen(true);
  };

  const handleView = (news: NewsPost) => {
    setViewingNews(news);
    setIsFormOpen(false);
    setEditingNews(null);
  };

  // Hàm xóa: Xử lý cả Local và API
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin tức này?')) return;

    // 1. Thử xóa trong LocalStorage trước
    const stored: NewsPost[] = JSON.parse(localStorage.getItem('localNews') || '[]');
    const newStored = stored.filter((n: NewsPost) => n.id !== id);
    
    // Nếu độ dài thay đổi nghĩa là đã xóa được trong local
    if (stored.length !== newStored.length) {
      localStorage.setItem('localNews', JSON.stringify(newStored));
      setLocalNews(newStored); // Cập nhật state
      alert('Xóa thành công!');
      return;
    }

    // 2. Nếu không có trong local, gọi API xóa
    try {
      const response = await fetch(`http://localhost:5000/News/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Xóa thành công!');
        dispatch(fetchNews());
      } else {
        alert('Có lỗi xảy ra khi xóa!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể kết nối đến server!');
    }
  };

  // Khi form thành công: reload API và reload Local
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingNews(null);
    dispatch(fetchNews());
    refreshLocalNews(); // Gọi hàm này để cập nhật lại list local
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingNews(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Quản lý Tin tức & Khuyến mãi</h1>
            <p className="text-gray-600">Tạo, chỉnh sửa và quản lý nội dung marketing</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-100 text-white hover:text-blue-600 px-5 py-3 rounded-lg transition shadow-lg hover:shadow-blue-500/50 cursor-pointer"
          >
            <Plus size={20} />
            Tạo tin tức mới
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* News List */}
        {loading ? (
          <div className="text-center text-gray-600 py-20">Đang tải tin tức...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Ảnh</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Tiêu đề</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Ngày đăng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Lead</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentNews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                      {searchTerm ? 'Không tìm thấy tin tức nào' : 'Chưa có tin tức'}
                    </td>
                  </tr>
                ) : (
                  currentNews.map((news) => (
                    <tr key={news.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <img src={news.image} alt={news.title} className="w-20 h-20 object-cover rounded" />
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium max-w-md">{news.title}</td>
                      <td className="px-6 py-4 text-gray-600">{news.date}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{news.lead || 'Chưa có mô tả'}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleView(news)} className="p-2 text-green-600 hover:bg-green-200 rounded-lg transition" title="Xem chi tiết"><Eye size={18} /></button>
                          <button onClick={() => handleEdit(news)} className="p-2 text-blue-600 hover:bg-blue-200 rounded-lg transition" title="Chỉnh sửa"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(news.id)} className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition" title="Xóa"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {filteredNews.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-300 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Hiển thị {startIndex + 1} - {Math.min(startIndex + POSTS_PER_PAGE, filteredNews.length)} trong tổng số {filteredNews.length} tin tức
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={handlePrev} disabled={currentPage === 1} className={`p-2 rounded-lg transition-colors ${currentPage === 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-200"}`}><ChevronLeft size={20} /></button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button key={number} onClick={() => paginate(number)} className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${currentPage === number ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-slate-600 hover:bg-slate-200"}`}>{number}</button>
                  ))}
                  <button onClick={handleNext} disabled={currentPage === totalPages} className={`p-2 rounded-lg transition-colors ${currentPage === totalPages ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-200"}`}><ChevronRight size={20} /></button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-200 rounded-lg shadow-2xl border border-gray-300 max-w-4xl w-full my-8">
              <div className="flex justify-between items-center p-6 border-b border-gray-300">
                <h2 className="text-2xl font-bold text-black">{editingNews ? 'Chỉnh sửa tin tức' : 'Tạo tin tức mới'}</h2>
                <button onClick={handleFormCancel} className="text-black hover:text-white transition"><X size={24} /></button>
              </div>
              <AddNewsForm editingNews={editingNews} onSuccess={handleFormSuccess} onCancel={handleFormCancel} isModal={true} />
            </div>
          </div>
        )}

        {/* View Detail Modal */}
        {viewingNews && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
              <div className="flex justify-between items-center p-6 border-b border-gray-300">
                <h2 className="text-2xl font-bold text-black">Chi tiết tin tức</h2>
                <button onClick={() => setViewingNews(null)} className="text-black hover:text-gray-800 transition"><X size={24} /></button>
              </div>
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="w-full"><img src={viewingNews.image} alt={viewingNews.title} className="w-full h-64 object-cover rounded-lg" /></div>
                <div><h1 className="text-3xl font-bold text-black">{viewingNews.title}</h1></div>
                <div className="flex items-center gap-2 text-black"><span className="font-medium">Ngày đăng:</span><span>{viewingNews.date}</span></div>
                {viewingNews.lead && <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded"><p className="text-black font-medium italic">{viewingNews.lead}</p></div>}
                {viewingNews.content && <div><h3 className="text-lg font-semibold text-black mb-2">Nội dung:</h3><p className="text-black whitespace-pre-wrap leading-relaxed">{viewingNews.content}</p></div>}
                {viewingNews.details && viewingNews.details.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-3">Chi tiết:</h3>
                    <ul className="space-y-2 bg-gray-50 rounded-lg p-4">
                      {viewingNews.details.map((detail, index) => (
                        <li key={index} className="flex gap-2 text-black"><span>{detail}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
                {viewingNews.detailImage && viewingNews.detailImage !== viewingNews.image && (
                  <div><h3 className="text-lg font-semibold text-black mb-2">Ảnh chi tiết:</h3><img src={viewingNews.detailImage} alt="Detail" className="w-full rounded-lg" /></div>
                )}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-300">
                  <button onClick={() => setViewingNews(null)} className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-black">Đóng</button>
                  <button onClick={() => { handleEdit(viewingNews); setViewingNews(null); }} className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold transition text-white flex items-center gap-2"><Edit size={18} />Chỉnh sửa</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagement;