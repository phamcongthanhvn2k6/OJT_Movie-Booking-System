// src/components/layout/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Khu vực nội dung chính bên phải */}
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
