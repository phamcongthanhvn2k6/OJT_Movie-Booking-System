import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const PaymentSuccessPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* 1. Header Global */}
      <Header />

      {/* 2. Nội dung chính (Căn giữa hoàn toàn) */}
      <main className="grow flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl w-full flex flex-col items-center">
          
          {/* Ảnh ngôi sao (Star Icon) */}
          <div className="mb-8">
            <img 
              src="../../../public/success-star.png" // Thay đường dẫn ảnh ngôi sao của bạn tại đây
              alt="Success Star" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            />
          </div>

          {/* Tiêu đề chính */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Đặt vé thành công!
          </h1>

          <p className="text-[#f97316] text-sm md:text-base mb-10  decoration-1 cursor-pointer">
            Lưu ý: Hãy đến đúng giờ của suất chiếu và tận hưởng bộ phim
          </p>

          {/* Nút về trang chủ (Bo tròn, màu đỏ) */}
          <Link 
            to="/" 
            className="w-full max-w-sm py-3.5 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-rose-900/20"
          >
            Về trang chủ
          </Link>
        </div>
      </main>

      {/* 3. Footer Global */}
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;