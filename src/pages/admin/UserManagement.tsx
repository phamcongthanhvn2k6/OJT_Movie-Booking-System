import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useState } from "react";
import {
  fetchUsers,
  updateUserThunk,
  deleteUserThunk,
} from "../../store/slices/user.slices";
import type { User, UserRole, UserStatus } from "../../types/user.type";

// Initial state cho form
const initialFormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  role: "user" as UserRole,
  status: "active" as UserStatus,
  avatar: "",
};

export default function UserManagement() {
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  // --- STATE ---
  const [searchUser, setSearchUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // --- LOGIC FILTER ---
  const userFilter = userState.list.filter((user) => {
    const searchKey = searchUser.toLowerCase();
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchKey) ||
      user.last_name.toLowerCase().includes(searchKey) ||
      user.email.toLowerCase().includes(searchKey);

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // --- LOGIC PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = userFilter.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(userFilter.length / itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchUser(e.target.value);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // --- HANDLERS ---

  // 1. Mở Modal Sửa
  const handleOpenEdit = (user: User) => {
    setCurrentUserId(user.id);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      role: user.role,
      status: user.status,
      avatar: user.avatar || "",
    });
    setIsModalOpen(true);
  };

  // 2. Xử lý Xóa
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      await dispatch(deleteUserThunk(id));
      // Nếu xóa item cuối cùng của trang hiện tại, lùi về trang trước
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // 3. Xử lý thay đổi Input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Submit Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUserId) {
      // 1. Tìm lại user gốc trong danh sách Redux để lấy các thông tin cũ (password, created_at...)
      const originalUser = userState.list.find((u) => u.id === currentUserId);

      if (!originalUser) {
        alert("Không tìm thấy thông tin người dùng gốc!");
        return;
      }

      // 2. Tạo payload bằng cách giữ lại thông tin cũ và ghi đè thông tin mới từ form
      const payload: User = {
        ...originalUser, // Giữ lại id, password, created_at cũ
        ...formData, // Ghi đè các trường đã sửa (name, email, role...)
        updated_at: new Date().toISOString(), // Cập nhật thời gian sửa mới nhất
      };

      // 3. Gửi đi
      await dispatch(updateUserThunk(payload));
      setIsModalOpen(false);
    }
  };

  // Helper render màu cho Role
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "staff":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // Helper render màu cho Status
  const getStatusBadge = (status: string) => {
    return status === "ACTIVE"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800">Quản lý người dùng</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm tên/ email..."
              value={searchUser}
              onChange={handleSearch}
              className="border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-indigo-500 w-full sm:w-64"
            />
          </div>

          <select
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-indigo-500 bg-white"
            value={selectedRole}
            onChange={(e) => {
              setCurrentPage(1);
              setSelectedRole(e.target.value);
            }}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">ADMIN</option>
            <option value="staff">STAFF</option>
            <option value="user">USER</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase">
              <th className="p-4 text-center w-12">STT</th>
              <th className="p-4">ID</th>
              <th className="p-4">Ảnh đại diện</th>
              <th className="p-4">Họ</th>
              <th className="p-4">Tên</th>
              <th className="p-4">Email</th>
              <th className="p-4">SĐT</th>
              <th className="p-4">Địa chỉ</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentUsers.map((u, index) => (
              <tr
                key={u.id}
                className="hover:bg-slate-50 text-slate-600 text-sm transition-colors"
              >
                <td className="p-4 text-center">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="p-4">#{u.id}</td>
                <td className="p-4">
                  <img
                    src={
                      u.avatar ||
                      `https://ui-avatars.com/api/?name=${u.last_name}+${u.first_name}&background=random`
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                </td>
                <td className="p-4">{u.first_name}</td>
                <td className="p-4">{u.last_name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.phone || "---"}</td>
                <td className="p-4 truncate max-w-[150px]" title={u.address}>
                  {u.address || "---"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      u.status
                    )}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getRoleBadge(
                      u.role
                    )}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION */}
      {userFilter.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 mt-4 rounded-b-xl">
          <span className="text-sm text-slate-500">
            Hiển thị{" "}
            <span className="font-bold text-slate-800">
              {indexOfFirstItem + 1}
            </span>{" "}
            -{" "}
            <span className="font-bold text-slate-800">
              {Math.min(indexOfLastItem, userFilter.length)}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-bold text-slate-800">
              {userFilter.length}
            </span>{" "}
            người dùng
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:bg-slate-200 hover:text-indigo-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                    currentPage === number
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:bg-slate-200 hover:text-indigo-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                Cập nhật người dùng
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Read-only Info */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Email (Không thể sửa)
                </label>
                <input
                  disabled
                  value={formData.email}
                  className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Họ
                  </label>
                  <input
                    required
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tên
                  </label>
                  <input
                    required
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white transition-shadow"
                  >
                    <option value="USER">USER</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:outline-none font-medium transition-shadow ${
                      formData.status === "ACTIVE"
                        ? "text-emerald-700 border-emerald-300 bg-emerald-50 focus:ring-emerald-500"
                        : "text-red-700 border-red-300 bg-red-50 focus:ring-red-500"
                    }`}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-200"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
