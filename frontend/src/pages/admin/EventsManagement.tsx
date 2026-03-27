import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, Edit, Trash2, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AppDispatch, RootState } from '../../store';
import { fetchEvents } from '../../store/slices/event.slice';
// [FIX 1] Thêm 'type' vào import để sửa lỗi verbatimModuleSyntax
import AddEventForm, { type EventCreate } from '../EventsPage/components/AddEventForm';

const POSTS_PER_PAGE = 8;

// Interface này dùng cho hiển thị danh sách
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

const EventsManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: apiEvents, loading } = useSelector(
    (state: RootState) => state.events as { list: Event[]; loading: boolean }
  );

  // State lưu sự kiện Local (Offline)
  const [localEvents, setLocalEvents] = useState<Event[]>(() => {
    try {
      const stored = localStorage.getItem('localEvents');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Lỗi đọc local events:", error);
      return [];
    }
  });

  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Gộp sự kiện API và Local
  const allEvents = [...localEvents, ...apiEvents];

  // Hàm xử lý khi Tạo thành công
  const handleCreateSuccess = (newEventData: EventCreate) => {
    const newEvent: Event = { 
        ...newEventData, 
        id: `local-${Date.now()}`
    };

    const updatedLocalEvents = [newEvent, ...localEvents];
    setLocalEvents(updatedLocalEvents);
    localStorage.setItem('localEvents', JSON.stringify(updatedLocalEvents));
    setIsCreating(false);
    alert("Đã tạo sự kiện thành công!");
  };

  // Hàm Xóa (Hỗ trợ xóa Local)
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
        if (id.startsWith('local-')) {
            const updated = localEvents.filter(e => e.id !== id);
            setLocalEvents(updated);
            localStorage.setItem('localEvents', JSON.stringify(updated));
        } else {
            console.log("Cần gọi API delete cho ID:", id);
            alert("Tính năng xóa API đang phát triển");
        }
    }
  };

  const filteredEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / POSTS_PER_PAGE);
  const indexOfLastEvent = currentPage * POSTS_PER_PAGE;
  const indexOfFirstEvent = indexOfLastEvent - POSTS_PER_PAGE;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleEditClick = (event: Event) => {
      setEditingEvent(event);
      setIsCreating(true);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Quản Lý Sự Kiện</h1>
            <p className="text-slate-500 mt-1">Danh sách các sự kiện đang diễn ra</p>
          </div>
          <button
            onClick={() => { setEditingEvent(null); setIsCreating(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
          >
            <PlusCircle size={20} />
            Thêm sự kiện
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && <div className="text-center py-10">Đang tải dữ liệu...</div>}

        {/* Table */}
        {!loading && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Sự kiện</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Ngày diễn ra</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Địa điểm</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={event.thumbnail || "https://via.placeholder.com/150"} 
                            alt={event.title} 
                            className="w-16 h-10 object-cover rounded-md shadow-sm" 
                          />
                          <div>
                            <h3 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{event.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-1">{event.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{event.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 max-w-[12.5rem] truncate">
                        {/* [FIX 3] Thay max-w-[200px] thành max-w-[12.5rem] hoặc class tương đương để fix warning */}
                        {event.venues || "Chưa cập nhật"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setSelectedEvent(event)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => handleEditClick(event)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(event.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentEvents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-400">Không tìm thấy sự kiện nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                  <button onClick={handlePrev} disabled={currentPage === 1} className={`p-2 rounded-lg transition-colors ${currentPage === 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-200 hover:text-indigo-600"}`}>
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${currentPage === number ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-slate-600 hover:bg-slate-200"}`}
                    >
                      {number}
                    </button>
                  ))}
                  <button onClick={handleNext} disabled={currentPage === totalPages} className={`p-2 rounded-lg transition-colors ${currentPage === totalPages ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-200 hover:text-indigo-600"}`}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Add/Edit Event */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#1f2937] w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
             <AddEventForm 
                /* [FIX 2] Thay 'as any' bằng 'as EventCreate' */
                editData={editingEvent as unknown as EventCreate} 
                onSuccess={handleCreateSuccess} 
                onCancel={() => setIsCreating(false)}
             />
          </div>
        </div>
      )}

      {/* Modal View Detail */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{selectedEvent.title}</h2>
            <div className="space-y-4">
                <img src={selectedEvent.thumbnail} alt="" className="w-full h-64 object-cover rounded-lg" />
                <p><strong>Ngày:</strong> {selectedEvent.date}</p>
                <p><strong>Địa điểm:</strong> {selectedEvent.venues}</p>
                <p><strong>Mô tả:</strong> {selectedEvent.description}</p>
                {selectedEvent.bannerUrl && <p className="text-sm text-gray-500">Có Banner chi tiết</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;