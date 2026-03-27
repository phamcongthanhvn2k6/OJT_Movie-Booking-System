import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Ticket, MapPin, Clock, Calendar, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface TicketDetails {
  booking_id: string;
  booking_time: string;
  total_price: number;
  payment_status: string;
  payment_method: string;
  transaction_id: string | null;
  movie_title: string;
  poster_url: string;
  start_time: string;
  end_time: string;
  theater_name: string;
  screen_name: string;
  seat_numbers: string;
}

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState<TicketDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_LOCAL}/api/user-bookings/${user.id}`);
        
        const now = new Date().getTime();
        const TEN_MINUTES = 10 * 60 * 1000; // 10 minutes

        const processedTickets = res.data.map((ticket: TicketDetails) => {
          let statusStr = ticket.payment_status;

          // Xử lý các vé bị null/trống payment_status (Không rõ) -> Thành Thất bại
          if (!statusStr) {
            statusStr = 'FAILED';
          }

          // Xử lý vé PENDING quá 10 phút -> Thành Thất bại
          if (statusStr === 'PENDING' && ticket.booking_time) {
            const bookingTime = new Date(ticket.booking_time).getTime();
            if (now - bookingTime > TEN_MINUTES) {
              statusStr = 'FAILED';
            }
          }

          return { ...ticket, payment_status: statusStr };
        });

        // Sắp xếp vé mới nhất lên đầu
        processedTickets.sort((a: TicketDetails, b: TicketDetails) => {
          const timeA = new Date(a.booking_time).getTime();
          const timeB = new Date(b.booking_time).getTime();
          return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
        });

        setTickets(processedTickets);
      } catch (err: any) {
        console.error("Lỗi lấy dữ liệu vé:", err);
        setError("Không thể tải danh sách vé. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const [selectedTicket, setSelectedTicket] = useState<TicketDetails | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'FAILED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Đã thanh toán';
      case 'PENDING': return 'Chờ thanh toán';
      case 'FAILED': return 'Thất bại';
      default: return status || 'Không rõ';
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if(isNaN(d.getTime())) return "";
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    if(isNaN(d.getTime())) return "";
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white w-full">
      <Header />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center border-b border-gray-800 pb-4">
          <Ticket className="mr-3 text-red-500 h-8 w-8" />
          Vé của tôi
        </h1>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl flex items-center justify-center">
            <XCircle className="mr-2" /> {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center bg-[#151A21] p-12 rounded-2xl border border-gray-800">
            <Ticket className="mx-auto h-16 w-16 text-gray-600 mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">Bạn chưa có giao dịch đặt vé nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div 
                key={ticket.booking_id} 
                className="bg-[#151A21] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all cursor-pointer shadow-lg group relative"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0B0F14] border-r border-gray-800"></div>
                <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0B0F14] border-l border-gray-800"></div>

                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-32 h-40 sm:h-full flex-shrink-0 relative overflow-hidden">
                    <img 
                      src={ticket.poster_url || "https://via.placeholder.com/150"} 
                      alt={ticket.movie_title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent sm:bg-gradient-to-r"></div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-center relative">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold line-clamp-1 pr-4">{ticket.movie_title}</h3>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded block border ${getStatusColor(ticket.payment_status)} whitespace-nowrap`}>
                        {getStatusText(ticket.payment_status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 mt-3 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {ticket.start_time ? formatDate(ticket.start_time) : "Đang cập nhật"}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {ticket.start_time ? formatTime(ticket.start_time) : ""}
                      </div>
                      <div className="flex items-center col-span-2">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{ticket.theater_name} - {ticket.screen_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block w-px border-l border-dashed border-gray-700 my-4"></div>

                  <div className="p-5 sm:w-48 flex flex-row sm:flex-col justify-between items-center sm:items-end bg-gray-900/30 sm:bg-transparent border-t sm:border-t-0 border-gray-800">
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Mã đặt vé</div>
                      <div className="font-mono font-medium text-gray-300">{ticket.booking_id.substring(0,8).toUpperCase()}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {ticket.total_price.toLocaleString('vi-VN')} đ
                      </div>
                      <button className="mt-2 text-xs font-medium text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Xem chi tiết &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
             onClick={() => setSelectedTicket(null)}>
          <div 
            className="bg-[#1A202C] border border-gray-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-48 bg-gray-800">
              <img 
                src={selectedTicket.poster_url || "https://via.placeholder.com/400"} 
                alt={selectedTicket.movie_title} 
                className="w-full h-full object-cover opacity-40 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A202C] to-transparent"></div>
              
              <button 
                onClick={() => setSelectedTicket(null)}
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 p-2 rounded-full backdrop-blur-md text-white transition-colors"
                aria-label="Bỏ qua"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="absolute bottom-0 left-0 w-full p-6 pb-2 text-center transform translate-y-6">
                <div className="w-24 h-36 mx-auto rounded-lg overflow-hidden border-2 border-gray-700 shadow-2xl">
                  <img src={selectedTicket.poster_url} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="pt-10 px-6 pb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-1">{selectedTicket.movie_title}</h2>
              <div className="inline-block mt-2 mb-6">
                <span className={`px-3 py-1 flex items-center text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(selectedTicket.payment_status)}`}>
                  {selectedTicket.payment_status === 'COMPLETED' ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                  {getStatusText(selectedTicket.payment_status)}
                </span>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 text-left border border-gray-800 space-y-3">
                <div className="flex justify-between pb-3 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Thời gian</span>
                  <span className="text-white font-medium text-sm text-right">
                    {formatTime(selectedTicket.start_time)} - {formatDate(selectedTicket.start_time)}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Rạp</span>
                  <span className="text-white font-medium text-sm text-right max-w-[60%] line-clamp-1">{selectedTicket.theater_name}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Phòng & Ghế</span>
                  <span className="text-white font-medium text-sm text-right">
                    {selectedTicket.screen_name} &bull; Ghế <span className="text-red-400 font-bold">{selectedTicket.seat_numbers || "Chưa cấp"}</span>
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-400 text-sm">Mã đặt vé</span>
                  <span className="text-white font-mono text-sm tracking-wider">{selectedTicket.booking_id.toUpperCase()}</span>
                </div>
              </div>

              <div className="mt-4 bg-gray-900 rounded-xl p-4 text-left border border-gray-800">
                <div className="flex justify-between pb-2 border-b border-gray-800 mb-2">
                  <span className="flex items-center text-gray-400 text-sm"><CreditCard className="w-4 h-4 mr-2" /> Phương thức</span>
                  <span className="text-white font-medium text-sm">{selectedTicket.payment_method || "N/A"}</span>
                </div>
                {selectedTicket.transaction_id && (
                  <div className="flex justify-between pb-2 border-b border-gray-800 mb-2">
                    <span className="text-gray-400 text-sm">Mã giao dịch</span>
                    <span className="text-white font-mono text-sm">{selectedTicket.transaction_id}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-sm">Tổng tiền</span>
                  <span className="text-2xl font-bold text-red-500">{selectedTicket.total_price.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>

            <div className="relative border-t border-dashed border-gray-700 bg-gray-900/50 p-4 pb-6">
              <div className="absolute left-[-16px] top-[-16px] w-8 h-8 rounded-full bg-black/80"></div>
              <div className="absolute right-[-16px] top-[-16px] w-8 h-8 rounded-full bg-black/80"></div>
              <p className="text-center text-xs text-gray-500 px-4">Hãy đưa mã đặt vé hoặc trang này cho nhân viên tại quầy để nhận vé giấy của bạn.</p>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyTicketsPage;
