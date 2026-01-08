// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom"; // 1. Import useNavigate
import {
  Film,
  Ticket,
  Users,
  UserCircle,
  TheaterIcon,
  TvIcon,
  Newspaper,
  CalendarCheck,
  DollarSignIcon,
  LogOut, // 2. Import Icon Logout
  Home,   // 3. Import Icon Home
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux"; // 4. Import useDispatch
import type { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice"; // 5. Import action logout
import { removeAuthToken } from "../../services/auth.service"; // 6. Import hàm xóa token

const Sidebar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: Home },
    { label: "Movies", href: "/admin/movies", icon: Film },
    { label: "Theater", href: "/admin/theaters", icon: TheaterIcon },
    { label: "Showtime", href: "/admin/showtime", icon: TvIcon },
    { label: "Price", href: "/admin/price", icon: DollarSignIcon },
    { label: "Bookings", href: "/admin/bookings", icon: Ticket },
    { label: "News", href: "/admin/News", icon: Newspaper },
    { label: "Events", href: "/admin/Events", icon: CalendarCheck },
    { label: "Users", href: "/admin/users", icon: Users },
  ];

  // --- HÀM XỬ LÝ ĐĂNG XUẤT ---
  const handleLogout = () => {
    // 1. Xóa token trong LocalStorage
    removeAuthToken();
    // 2. Xóa state user trong Redux
    dispatch(logout());
    // 3. Điều hướng về trang login
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0 left-0">
      {/* 1. Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-50">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg mr-3 flex items-center justify-center">
          <Film className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-lg">Admin Portal</h1>
          <p className="text-xs text-gray-400">Movie System</p>
        </div>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 3. Bottom Actions & User Profile */}
      <div className="p-4 border-t border-gray-200 space-y-4">
        
        {/* --- CÁC NÚT MỚI THÊM: HOME & LOGOUT --- */}
        <div className="space-y-1">
          {/* Nút Về Trang Chủ */}
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5 mr-3" />
            Trang chủ Website
          </button>

          {/* Nút Đăng Xuất */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </button>
        </div>

        {/* Separator nhỏ */}
        <div className="border-t border-gray-100"></div>

        {/* User Info (Giữ nguyên logic cũ) */}
        {user ? (
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-6 h-6 text-gray-500" />
              )}
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user.last_name} {user.first_name}
              </p>
              <p className="text-xs text-gray-500 truncate" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 animate-pulse pt-2">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded">Loading</div>
              <div className="h-2 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;