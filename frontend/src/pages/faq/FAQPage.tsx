import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'booking' | 'payment' | 'account' | 'theater';
}

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'booking' | 'payment' | 'account' | 'theater'>('all');

  const faqs: FAQItem[] = [
    {
      category: 'booking',
      question: 'Làm thế nào để tôi mua vé trực tuyến?',
      answer: 'Bạn chỉ cần chọn phim mong muốn tại Trang chủ, nhấn vào phim để xem chi tiết, chọn suất chiếu, chọn ghế ngồi trống trên sơ đồ và thực hiện thanh toán online. Sau khi thanh toán thành công, mã vé sẽ được gửi trực tiếp đến email của bạn và hiển thị trong mục "Vé của tôi".'
    },
    {
      category: 'booking',
      question: 'Tôi có thể mua tối đa bao nhiêu vé trong một lần giao dịch?',
      answer: 'Để tránh đầu cơ vé, hệ thống quy định tối đa bạn được mua 8 vé xem phim cho mỗi giao dịch đặt vé trực tuyến.'
    },
    {
      category: 'payment',
      question: 'Hệ thống hỗ trợ các phương thức thanh toán nào?',
      answer: 'Hiện tại, chúng tôi hỗ trợ thanh toán cực kỳ tiện lợi thông qua cổng thanh toán PayOS. Bạn có thể sử dụng ví điện tử, chuyển khoản nhanh App Ngân hàng qua quét mã QR Code, hoặc thẻ ATM nội địa.'
    },
    {
      category: 'payment',
      question: 'Tiền đã bị trừ trong tài khoản nhưng tôi chưa nhận được mã vé?',
      answer: 'Do kết nối mạng hoặc xử lý ngân hàng, đôi khi email xác nhận có thể bị trễ từ 5-10 phút. Bạn vui lòng kiểm tra hộp thư rác (Spam) hoặc vào mục "Vé của tôi" trên tài khoản web để kiểm tra lịch sử giao dịch. Nếu quá 30 phút vẫn chưa nhận được, vui lòng liên hệ hotline: 024.35141791 để được hỗ trợ nhanh nhất.'
    },
    {
      category: 'account',
      question: 'Làm thế nào để tôi thay đổi thông tin cá nhân hoặc mật khẩu?',
      answer: 'Sau khi đăng nhập vào hệ thống, bạn click vào Tên tài khoản ở góc trên bên phải trang web, chọn mục "Thông tin cá nhân". Tại đây bạn có thể cập nhật ảnh đại diện, số điện thoại, địa chỉ và thực hiện đổi mật khẩu mới.'
    },
    {
      category: 'theater',
      question: 'Tôi nên đến rạp trước bao lâu để lấy vé giấy?',
      answer: 'Chúng tôi khuyến khích khách hàng có mặt trước giờ chiếu tối thiểu 10-15 phút để xuất trình mã đặt vé tại quầy in vé giấy hoặc quầy soát vé tự động, tránh ùn tắc sát giờ chiếu.'
    },
  ];

  const filteredFaqs = faqs.filter(faq => activeCategory === 'all' || faq.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const categories = [
    { id: 'all', label: 'Tất cả câu hỏi' },
    { id: 'booking', label: 'Đặt vé xem phim' },
    { id: 'payment', label: 'Thanh toán online' },
    { id: 'account', label: 'Tài khoản thành viên' },
    { id: 'theater', label: 'Quy định tại rạp' },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-[#020d18] text-white">
      <Header />
      <main className="grow py-12 px-4 md:px-20 max-w-4xl mx-auto w-full">
        
        {/* Title */}
        <div className="flex items-center gap-2 mb-10 border-l-4 border-red-600 pl-4">
          <h1 className="text-3xl font-bold uppercase tracking-wide">Hỏi đáp thường gặp (FAQ)</h1>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                activeCategory === cat.id
                  ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-[#0f172a] border border-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-200 hover:text-white hover:bg-gray-800/30 transition-all duration-200"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-red-500 shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-sm text-gray-300 border-t border-gray-800/50 leading-relaxed bg-gray-900/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
