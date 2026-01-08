import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, ChevronDown, AlertCircle, Menu, X ,Heart} from 'lucide-react';
import type { RootState } from '../store';
import { logout } from '../store/slices/authSlice';

const NCCHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Lịch chiếu', path: '/showtimes' },
    { label: 'Tin tức', path: '/tin-tuc' },
    { label: 'Khuyến mãi', path: '/promotion' },
    { label: 'Giá vé', path: '/ticketprice' },
    { label: 'Liên hoan phim', path: '/lien-hoan-phim' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setIsMobileMenuOpen(true);
      document.body.style.overflow = 'hidden';
    } else {
      closeMobileMenu();
    }
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      {/* 
        Responsive heights:
        - Mobile 390px: h-[54px]
        - Mobile 480px: h-14 (56px)
        - Tablet 768px: h-[60px]
        - Desktop: auto với py-4
      */}
      <nav className=" sm:px-5 md:px-6 h-[54px] min-[390px]:h-14 md:h-[0px] lg:h-auto lg:py-4">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center hover:opacity-80 transition-opacity mr-8 xs:mr-12 min-[480px]:mr-14 sm:mr-44 md:mr-56 lg:mr-0"
            onClick={closeMobileMenu}
          >
            <img 
              src="https://res.cloudinary.com/dyj2auia8/image/upload/v1766623098/image_zspgoq.png" 
              alt="NCC Cinema Logo" 
              className="h-[26px] xs:h-7 min-[480px]:h-[28px] md:h-8 lg:h-10 w-auto object-contain" 
            />
            <div className="ml-1.5 xs:ml-2 md:ml-2.5 lg:ml-3">
              <div className="text-[10px] xs:text-[10.5px] min-[480px]:text-[11px] md:text-xs lg:text-base font-bold uppercase leading-tight tracking-tight">
                Trung tâm chiếu phim quốc gia
              </div>
              <div className="text-[9px] xs:text-[9.5px] min-[480px]:text-[10px] md:text-[10px] lg:text-xs font-medium text-gray-400 leading-tight">
                National Cinema Center
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Menu - Hidden on tablet and mobile */}
          <ul className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`text-sm font-medium transition-all duration-200 hover:text-red-500 ${
                    isActive(item.path) ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Section - Hidden on tablet and mobile */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full transition-all border border-gray-700"
                >
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="h-8 w-8 rounded-full border border-red-500" 
                  />
                  <span className="text-sm font-medium hidden xl:block">
                    {user.first_name}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 text-red-500" />
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <Link 
                      to="/favorites" 
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Phim yêu thích</span>
                    </Link>
                    
                    <button 
                      onClick={handleLogoutClick}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-red-900/30 text-red-400 transition-colors mt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="px-5 py-2 border-2 border-white rounded-full text-sm font-medium hover:bg-white hover:text-gray-900 transition-all duration-200"
                >
                  Đăng ký
                </Link>
                <Link 
                  to="/login" 
                  className="px-5 py-2 bg-red-600 rounded-full text-sm font-medium hover:bg-red-700 transition-all duration-200 shadow-lg"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Show on tablet and mobile */}
          <button 
            className="lg:hidden flex items-center justify-center p-1.5 xs:p-2 md:p-2.5 rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 xs:h-[22px] xs:w-[22px] md:h-6 md:w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed top-[54px] min-[480px]:top-14 md:top-[60px] left-0 w-full h-[calc(100vh-54px)] min-[480px]:h-[calc(100vh-3.5rem)] md:h-[calc(100vh-60px)] bg-black/50 backdrop-blur-sm z-[99] transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Container (Drawer) */}
      <div className={`fixed top-[54px] min-[480px]:top-14 md:top-[60px] left-0 w-full h-[calc(100vh-54px)] min-[480px]:h-[calc(100vh-3.5rem)] md:h-[calc(100vh-60px)] bg-gray-900 overflow-y-auto z-[100] transition-transform duration-300 shadow-2xl lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Close Button */}
        <div className="flex justify-end p-2.5 xs:p-3 md:p-4 border-b border-gray-800">
          <button 
            onClick={closeMobileMenu}
            className="p-1.5 xs:p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 xs:h-[22px] xs:w-[22px] md:h-6 md:w-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 xs:px-5 md:px-6 py-3.5 xs:py-4 md:py-[18px] text-[13px] xs:text-sm md:text-[15px] font-medium border-b border-gray-800 transition-all ${
                isActive(item.path)
                  ? 'bg-gray-800 text-red-500 border-l-[3px] border-l-red-500 font-semibold'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-red-500 hover:pl-6 xs:hover:pl-7 md:hover:pl-8'
              }`}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 xs:p-5 md:p-6 border-t-2 border-gray-700 bg-slate-900">
          {isAuthenticated && user ? (
            <>
<div className="flex items-center mb-3 xs:mb-4 pb-3 xs:pb-4 border-b border-gray-800">
        <img 
          src={user.avatar} 
          alt="Avatar" 
          className="w-9 h-9 xs:w-10 xs:h-10 md:w-11 md:h-11 rounded-full border-2 border-red-500 mr-2.5 xs:mr-3"
        />
        <span className="text-[14px] xs:text-sm md:text-base font-semibold text-white">
          {user.first_name}
        </span>
      </div>

      {/* 2. Danh sách nút chức năng */}
      <div className="flex flex-col gap-1.5 xs:gap-2">
        
        {/* Nút: Thông tin cá nhân */}
        <Link
          to="/profile"
          className="flex items-center justify-center px-4 xs:px-5 md:px-6 py-2.5 xs:py-3 md:py-[14px] text-[13px] xs:text-sm md:text-[15px] font-medium text-gray-300 bg-transparent border border-gray-700 rounded-lg hover:bg-gray-800 hover:text-red-500 transition-all"
          onClick={closeMobileMenu}
        >
          <User className="inline h-4 w-4 mr-2" />
          Thông tin cá nhân
        </Link>

        {/* --- [MỚI] Nút: Phim yêu thích --- */}
        <Link
          to="/favorites" 
          className="flex items-center justify-center px-4 xs:px-5 md:px-6 py-2.5 xs:py-3 md:py-[14px] text-[13px] xs:text-sm md:text-[15px] font-medium text-gray-300 bg-transparent border border-gray-700 rounded-lg hover:bg-gray-800 hover:text-red-500 transition-all"
          onClick={closeMobileMenu}
        >
          {/* Icon trái tim */}
          <Heart className="inline h-4 w-4 mr-2" /> 
          Phim yêu thích
        </Link>
        {/* -------------------------------- */}

        {/* Nút: Đăng xuất */}
        <button
          onClick={handleLogoutClick}
          className="flex items-center justify-center px-4 xs:px-5 md:px-6 py-2.5 xs:py-3 md:py-[14px] text-[13px] xs:text-sm md:text-[15px] font-medium text-red-400 bg-red-500/10 border border-gray-700 rounded-lg hover:bg-red-500/20 transition-all"
        >
          <LogOut className="inline h-4 w-4 mr-2" />
          Đăng xuất
        </button>
      </div>
            </>
          ) : (
            <div className="flex flex-col gap-2.5 xs:gap-3">
              <Link
                to="/login"
                className="block text-center px-4 xs:px-5 md:px-6 py-2.5 xs:py-3 md:py-[14px] text-[13px] xs:text-sm md:text-[15px] font-semibold text-white bg-red-600 border-none rounded-lg hover:bg-red-700 transition-colors"
                onClick={closeMobileMenu}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="block text-center px-4 xs:px-5 md:px-6 py-2.5 xs:py-3 md:py-[14px] text-[13px] xs:text-sm md:text-[15px] font-semibold text-white bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-all"
                onClick={closeMobileMenu}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-800 border border-gray-700 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                Xác nhận đăng xuất
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Bạn có chắc chắn muốn rời khỏi NCC Cinema? Các thay đổi chưa lưu có thể bị mất.
              </p>

              <div className="flex w-full space-x-3">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NCCHeader;