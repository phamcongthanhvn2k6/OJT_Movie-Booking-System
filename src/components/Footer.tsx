import React from 'react';
import { Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const footerMenu: string[] = [
    'Chính sách',
    'Lịch chiếu',
    'Tin tức',
    'Giá vé',
    'Hỏi đáp',
    'Liên hệ'
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className=" px-6">
        
        {/* Footer Navigation Menu */}
        <div className="flex justify-center mb-8">
          <ul className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {footerMenu.map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className="text-sm hover:text-red-500 transition-colors duration-200 font-medium"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media & App Downloads - All in One Row */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
          
          {/* Social Media Icons */}
          <a 
            href="#" 
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 text-white" />
          </a>
          
          <a 
            href="#" 
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
            aria-label="Zalo"
          >
            <div className="text-white font-bold text-sm">Z</div>
          </a>
          
          <a 
            href="#" 
            className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
            aria-label="YouTube"
          >
            <Youtube className="w-5 h-5 text-white" />
          </a>

          {/* App Download Buttons */}
          <a 
            href="#" 
            className="hover:opacity-80 transition-opacity duration-200"
          >
            <img 
              src="/GG Play.png" 
              alt="Tải trên Google Play" 
              className="h-12 w-auto object-contain"
            />
          </a>
          
          <a 
            href="#" 
            className="hover:opacity-80 transition-opacity duration-200"
          >
            <img 
              src="/App store.png" 
              alt="Tải trên App Store" 
              className="h-12 w-auto object-contain"
            />
          </a>

          {/* Government Certificate */}
          <img 
            src="/Copyright.png" 
            alt="Đã thông báo Bộ Công Thương" 
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Legal Information & Contact */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <p className="text-sm text-white leading-relaxed">
            Cơ quan chủ quản: BỘ VĂN HÓA, THỂ THAO VÀ DU LỊCH
          </p>
          <p className="text-sm text-white leading-relaxed">
            Bản quyền thuộc Trung tâm Chiếu phim Quốc gia.
          </p>
          <p className="text-sm text-white leading-relaxed">
            Giấy phép số: 224/GP- TTĐT ngày 31/8/2010 - Chịu trách nhiệm: Vũ Đức Tùng – Giám đốc.
          </p>
          <p className="text-sm text-white leading-relaxed">
            Địa chỉ: 87 Láng Hạ, Quận Ba Đình, Tp. Hà Nội - Điện thoại: 024.35141791
          </p>
          <p className="text-sm text-white mt-4">
            © 2023 By NCC - All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;