// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthToken } from "../services/auth.service";
import type { RootState } from "../store"; // Đảm bảo bạn đã export type RootState từ store
import type { ReactNode } from "react";
// Đảm bảo bạn đã export type RootState từ store

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Danh sách các quyền được phép truy cập (vd: ['admin'])
  children?: ReactNode;
}

export const ProtectedRoute = ({
  allowedRoles,
  children,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const token = getAuthToken();
  const { user, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // 1. Trạng thái đang tải: Đợi App.tsx fetch lại profile từ Token khi F5 trang
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
        <span className="ml-3">Đang xác thực...</span>
      </div>
    );
  }

  // 2. Kiểm tra Token: Nếu không có token ở localStorage, ép về Login
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra Phân quyền (Role-based):
  // Nếu trang yêu cầu quyền cụ thể mà User trong RAM không có quyền đó
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  // 4. Hợp lệ: Trả về các Component con bên trong
  return children ? <>{children}</> : <Outlet />;
};
