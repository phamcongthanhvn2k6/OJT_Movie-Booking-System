import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ShieldCheck, RefreshCw, FileText, Lock } from 'lucide-react';

export const PolicyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'refund' | 'privacy' | 'booking'>('general');

  const tabs = [
    { id: 'general', label: 'Điều khoản chung', icon: FileText },
    { id: 'refund', label: 'Chính sách đổi trả/hoàn vé', icon: RefreshCw },
    { id: 'privacy', label: 'Chính sách bảo mật', icon: Lock },
    { id: 'booking', label: 'Quy định mua vé', icon: ShieldCheck },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-[#020d18] text-white">
      <Header />
      <main className="grow py-12 px-4 md:px-20 max-w-7xl mx-auto w-full">
        
        {/* Title */}
        <div className="flex items-center gap-2 mb-10 border-l-4 border-red-600 pl-4">
          <h1 className="text-3xl font-bold uppercase tracking-wide">Chính sách & Quy định</h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap border-b border-gray-800 gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 rounded-t-lg ${
                  isActive 
                    ? 'border-red-600 text-red-500 bg-gray-900' 
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 md:p-10 shadow-2xl leading-relaxed">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-red-500 border-b border-gray-800 pb-2">1. Thỏa thuận sử dụng dịch vụ</h2>
              <p>Chào mừng bạn đến với hệ thống đặt vé xem phim trực tuyến của chúng tôi. Khi sử dụng trang web này, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng dưới đây.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4">2. Quyền sở hữu trí tuệ</h3>
              <p>Mọi nội dung trên trang web bao gồm văn bản, thiết kế, hình ảnh, mã nguồn đều thuộc sở hữu của chúng tôi hoặc các đối tác cung cấp nội dung được cấp phép hợp pháp. Việc sao chép, sử dụng khi chưa được sự cho phép bằng văn bản là vi phạm pháp luật.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4">3. Thay đổi dịch vụ</h3>
              <p>Chúng tôi giữ quyền thay đổi, chỉnh sửa điều khoản sử dụng hoặc ngừng bất kỳ tính năng dịch vụ nào trên hệ thống vào bất kỳ thời điểm nào mà không cần thông báo trước.</p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-red-500 border-b border-gray-800 pb-2 font-semibold">1. Quy định đổi trả vé xem phim</h2>
              <p>Để đảm bảo công bằng cho tất cả các khách hàng, vé xem phim đã mua trực tuyến thành công sẽ **không thể đổi hoặc trả lại dưới bất kỳ hình thức nào**.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4">2. Các trường hợp ngoại lệ đặc biệt</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Sự cố kỹ thuật từ phía rạp chiếu (mất điện kéo dài, lỗi thiết bị chiếu phim, lỗi âm thanh) khiến suất chiếu bị hủy bỏ hoàn toàn.</li>
                <li>Lịch chiếu của phim bị thay đổi đột xuất bởi Trung tâm hoặc nhà phát hành.</li>
                <li>Trong các trường hợp này, khách hàng sẽ được hoàn trả 100% tiền vé trực tiếp vào phương thức thanh toán ban đầu hoặc nhận voucher xem phim tương đương.</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-white mt-4">3. Quy trình giải quyết sự cố hoàn vé</h3>
              <p>Nếu gặp các sự cố kỹ thuật trên, vui lòng liên hệ trực tiếp với bộ phận chăm sóc khách hàng tại Quầy vé của rạp hoặc gọi Hotline chăm sóc khách hàng trong vòng 24 giờ kể từ thời điểm suất chiếu diễn ra.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-red-500 border-b border-gray-800 pb-2 font-semibold">1. Thu thập thông tin cá nhân</h2>
              <p>Hệ thống chỉ thu thập các thông tin cá nhân cơ bản (Email, Số điện thoại, Họ tên) cần thiết để phục vụ mục đích đặt vé, xác minh danh tính nhận vé tại rạp và gửi thông tin xác nhận giao dịch.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4">2. Cam kết bảo mật thông tin</h3>
              <p>Chúng tôi cam kết bảo mật tuyệt đối dữ liệu khách hàng. Không chia sẻ, bán hay chuyển giao thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào khi chưa có sự đồng ý của bạn, ngoại trừ các trường hợp theo yêu cầu của cơ quan pháp luật.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4">3. Sử dụng Cookie</h3>
              <p>Hệ thống sử dụng cookies để lưu trữ phiên đăng nhập và ghi nhớ các lựa chọn của bạn nhằm tối ưu hóa trải nghiệm sử dụng trang web tốt nhất.</p>
            </div>
          )}

          {activeTab === 'booking' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-red-500 border-b border-gray-800 pb-2 font-semibold">1. Quy định về độ tuổi xem phim</h2>
              <p>Khách hàng cần tuân thủ nghiêm ngặt quy định về giới hạn độ tuổi xem phim của Bộ Văn hóa, Thể thao và Du lịch:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><strong className="text-white">P (Phổ biến):</strong> Phim dành cho mọi đối tượng.</li>
                <li><strong className="text-white">K:</strong> Phim dành cho khán giả dưới 13 tuổi với điều kiện xem cùng cha, mẹ hoặc người giám hộ.</li>
                <li><strong className="text-white">T13 (13+):</strong> Phim cấm phổ biến đến khán giả dưới 13 tuổi.</li>
                <li><strong className="text-white">T16 (16+):</strong> Phim cấm phổ biến đến khán giả dưới 16 tuổi.</li>
                <li><strong className="text-white">T18 (18+):</strong> Phim cấm phổ biến đến khán giả dưới 18 tuổi.</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-white mt-4">2. Nhận vé tại quầy</h3>
              <p>Vui lòng xuất trình mã vé (QR Code hoặc mã đặt vé gửi qua Email) cho nhân viên soát vé tại rạp tối thiểu 10 phút trước giờ chiếu để in vé giấy vào phòng chiếu.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolicyPage;
