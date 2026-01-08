/* eslint-disable @typescript-eslint/no-explicit-any */
// đang sử dụng json-server để làm backend giả lập. Khi bạn thực hiện Create, Update, Delete:

// Ứng dụng gửi request lên json-server.

// json-server ghi đè dữ liệu mới vào file db.json (hoặc file data bạn đang dùng).

// Vite (trình chạy React) phát hiện có một file trong thư mục dự án vừa bị thay đổi (db.json).

// Theo mặc định, Vite nghĩ vừa sửa code, nên nó tự động Reload lại trang để cập nhật thay đổi.

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchTheaters,
  createNewTheater,
  updateTheaterThunk,
  deleteTheaterThunk,
} from "../../store/slices/theater.slices";
import {
  fetchScreensByTheater,
  createScreen,
  updateScreen,
  deleteScreen,
} from "../../store/slices/screen.slices";
import {
  fetchSeatsByScreen,
  createSeat,
  updateSeat,
  deleteSeat,
} from "../../store/slices/seat.slices";
import type { Theater } from "../../types/theater.type";
import type { Screen } from "../../types/screens.type";
import type { Seat, SeatType } from "../../types/seat.type";
import type { AppDispatch, RootState } from "../../store";

// ============================================================================
// FORM COMPONENTS
// ============================================================================

interface TheaterFormProps {
  initialData?: Theater | null;
  onSubmit: (data: { name: string; location: string; phone: string }) => void;
  onCancel: () => void;
}

const TheaterForm: React.FC<TheaterFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    location: initialData?.location || "",
    phone: initialData?.phone || "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tên Rạp <span className="text-red-500">*</span>
        </label>
        <input
          required
          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="VD: CGV Vincom"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Địa chỉ <span className="text-red-500">*</span>
        </label>
        <input
          required
          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="VD: 123 Đường A..."
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Số điện thoại
        </label>
        <input
          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="VD: 0123456789"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all"
        >
          Lưu Rạp
        </button>
      </div>
    </form>
  );
};

interface ScreenFormProps {
  initialData?: Screen | null;
  onSubmit: (data: { name: string; seat_capacity: number }) => void;
  onCancel: () => void;
}

const ScreenForm: React.FC<ScreenFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    seat_capacity: initialData?.seat_capacity || 0,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tên Phòng <span className="text-red-500">*</span>
        </label>
        <input
          required
          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="VD: Cinema 01"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sức chứa (Dự kiến)
        </label>
        <input
          type="number"
          min="0"
          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          value={formData.seat_capacity}
          onChange={(e) =>
            setFormData({
              ...formData,
              seat_capacity: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-lg shadow-green-200 transition-all"
        >
          Lưu Phòng
        </button>
      </div>
    </form>
  );
};

interface SeatFormProps {
  initialData?: Seat | null;
  onSubmit: (data: { seat_number: string; type: SeatType }) => void;
  onCancel: () => void;
}

const SeatForm: React.FC<SeatFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<{
    seat_number: string;
    type: SeatType;
  }>({
    seat_number: initialData?.seat_number || "",
    type: initialData?.type || "STANDARD",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Số ghế (VD: A1, B2) <span className="text-red-500">*</span>
        </label>
        <input
          required
          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase"
          value={formData.seat_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              seat_number: e.target.value.toUpperCase(),
            })
          }
          placeholder="A1"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Loại ghế
        </label>
        <select
          className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as SeatType })
          }
        >
          <option value="STANDARD">Thường (Standard)</option>
          <option value="VIP">VIP</option>
          <option value="SWEETBOX">Sweetbox (Đôi)</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium shadow-lg shadow-purple-200 transition-all"
        >
          Lưu Ghế
        </button>
      </div>
    </form>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TheaterManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux Data
  const { list: theaterList, loading: theaterLoading } = useSelector(
    (state: RootState) => state.theater
  );
  const { list: screenList, loading: screenLoading } = useSelector(
    (state: RootState) => state.screen
  );
  const { list: seatList, loading: seatLoading } = useSelector(
    (state: RootState) => state.seat
  );

  // UI State
  const [expandedTheaters, setExpandedTheaters] = useState<Set<string>>(
    new Set()
  );
  const [expandedScreens, setExpandedScreens] = useState<Set<string>>(
    new Set()
  );

  // Modal State
  const [modalType, setModalType] = useState<
    "THEATER" | "SCREEN" | "SEAT" | null
  >(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedTheaterForScreen, setSelectedTheaterForScreen] =
    useState<Theater | null>(null);
  const [selectedScreenForSeat, setSelectedScreenForSeat] =
    useState<Screen | null>(null);

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchTheaters());
  }, [dispatch]);

  // Load screens when theater is expanded
  useEffect(() => {
    expandedTheaters.forEach((theaterId) => {
      dispatch(fetchScreensByTheater(theaterId));
    });
  }, [expandedTheaters, dispatch]);

  // Load seats when screen is expanded
  useEffect(() => {
    expandedScreens.forEach((screenId) => {
      dispatch(fetchSeatsByScreen(screenId));
    });
  }, [expandedScreens, dispatch]);

  // Toggle theater expansion
  const toggleTheater = (theaterId: string) => {
    const newExpanded = new Set(expandedTheaters);
    if (newExpanded.has(theaterId)) {
      newExpanded.delete(theaterId);
    } else {
      newExpanded.add(theaterId);
      dispatch(fetchScreensByTheater(theaterId));
    }
    setExpandedTheaters(newExpanded);
  };

  // Toggle screen expansion
  const toggleScreen = (screenId: string) => {
    const newExpanded = new Set(expandedScreens);
    if (newExpanded.has(screenId)) {
      newExpanded.delete(screenId);
    } else {
      newExpanded.add(screenId);
      dispatch(fetchSeatsByScreen(screenId));
    }
    setExpandedScreens(newExpanded);
  };

  // CRUD Handlers

  // Theater CRUD
  const handleSaveTheater = async (formData: any) => {
    try {
      if (editingItem) {
        await dispatch(
          updateTheaterThunk({ ...editingItem, ...formData })
        ).unwrap();
      } else {
        await dispatch(createNewTheater(formData)).unwrap();
      }
      setModalType(null);
      setEditingItem(null);
      // dispatch(fetchTheaters());
    } catch (error: any) {
      console.error("Lỗi lưu Rạp:", error);
      alert("Lỗi lưu Rạp: " + (error?.message || error));
    }
  };

  const handleDeleteTheater = async (id: string) => {
    if (window.confirm("Xóa Rạp này? (Toàn bộ phòng và ghế sẽ mất)")) {
      try {
        await dispatch(deleteTheaterThunk(id)).unwrap();
        // dispatch(fetchTheaters());
        const newExpanded = new Set(expandedTheaters);
        newExpanded.delete(id);
        setExpandedTheaters(newExpanded);
      } catch (error: any) {
        console.error("Lỗi xóa Rạp:", error);
        alert("Lỗi xóa Rạp: " + (error?.message || error));
      }
    }
  };

  // Screen CRUD
  const handleSaveScreen = async (formData: any) => {
    if (!selectedTheaterForScreen) return;
    try {
      if (editingItem) {
        await dispatch(
          updateScreen({
            ...editingItem,
            ...formData,
            theater_id: selectedTheaterForScreen.id,
          })
        ).unwrap();
      } else {
        await dispatch(
          createScreen({
            ...formData,
            theater_id: selectedTheaterForScreen.id,
          })
        ).unwrap();
      }
      setModalType(null);
      setEditingItem(null);
      setSelectedTheaterForScreen(null);
      // if (selectedTheaterForScreen) {
      //   dispatch(fetchScreensByTheater(selectedTheaterForScreen.id));
      // }
    } catch (error: any) {
      console.error("Lỗi lưu Phòng:", error);
      alert("Lỗi lưu Phòng: " + (error?.message || error));
    }
  };

  const handleDeleteScreen = async (id: string) => {
    if (window.confirm("Xóa Phòng này?")) {
      try {
        await dispatch(deleteScreen(id)).unwrap();
        // Find which theater this screen belongs to and refresh
        // const screen = screenList.find((s) => s.id === id);
        // if (screen) {
        //   dispatch(fetchScreensByTheater(screen.theater_id));
        // }
        const newExpanded = new Set(expandedScreens);
        newExpanded.delete(id);
        setExpandedScreens(newExpanded);
      } catch (error: any) {
        console.error("Lỗi xóa Phòng:", error);
        alert("Lỗi xóa Phòng: " + (error?.message || error));
      }
    }
  };

  // Seat CRUD
  const handleSaveSeat = async (formData: {
    seat_number: string;
    type: SeatType;
  }) => {
    if (!selectedScreenForSeat) return;
    try {
      if (editingItem) {
        const updatePayload: Seat = {
          ...editingItem,
          seat_number: formData.seat_number,
          type: formData.type,
          screen_id: selectedScreenForSeat.id,
          is_variable: editingItem.is_variable ?? true,
          updated_at: new Date(),
        };
        await dispatch(updateSeat(updatePayload)).unwrap();
      } else {
        const createPayload = {
          seat_number: formData.seat_number,
          type: formData.type,
          screen_id: selectedScreenForSeat.id,
          is_variable: true,
        };
        await dispatch(createSeat(createPayload)).unwrap();
      }
      setModalType(null);
      setEditingItem(null);
      setSelectedScreenForSeat(null);
      // if (selectedScreenForSeat) {
      //   dispatch(fetchSeatsByScreen(selectedScreenForSeat.id));
      // }
    } catch (error: any) {
      console.error("Lỗi lưu Ghế:", error);
      alert("Lỗi lưu Ghế: " + (error?.message || error));
    }
  };

  const handleDeleteSeat = async (id: string) => {
    if (window.confirm("Xóa Ghế này?")) {
      try {
        await dispatch(deleteSeat(id)).unwrap();
        // Find which screen this seat belongs to and refresh
        // const seat = seatList.find((s) => s.id === id);
        // if (seat?.screen_id) {
        //   dispatch(fetchSeatsByScreen(seat.screen_id));
        // }
      } catch (error: any) {
        console.error("Lỗi xóa Ghế:", error);
        alert("Lỗi xóa Ghế: " + (error?.message || error));
      }
    }
  };

  // Get seats for a specific screen
  const getSeatsForScreen = (screenId: string) => {
    return seatList.filter((seat) => seat.screen_id === screenId);
  };

  // Get screens for a specific theater
  const getScreensForTheater = (theaterId: string) => {
    return screenList.filter((screen) => screen.theater_id === theaterId);
  };

  // Helper: Get seat color
  const getSeatColor = (type: SeatType) => {
    if (type === "VIP")
      return "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 text-yellow-900";
    if (type === "SWEETBOX")
      return "bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-400 text-pink-900";
    return "bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 text-gray-700";
  };

  // Render Modal
  const renderModal = () => {
    if (!modalType) return null;

    let title = "";
    let content = null;

    if (modalType === "THEATER") {
      title = editingItem ? "Cập nhật Rạp" : "Thêm Rạp Mới";
      content = (
        <TheaterForm
          key={editingItem ? `edit-${editingItem.id}` : "create-new"}
          initialData={editingItem}
          onSubmit={handleSaveTheater}
          onCancel={() => {
            setModalType(null);
            setEditingItem(null);
          }}
        />
      );
    } else if (modalType === "SCREEN") {
      title = editingItem ? "Cập nhật Phòng" : "Thêm Phòng Mới";
      content = (
        <ScreenForm
          key={editingItem ? `edit-${editingItem.id}` : "create-new"}
          initialData={editingItem}
          onSubmit={handleSaveScreen}
          onCancel={() => {
            setModalType(null);
            setEditingItem(null);
            setSelectedTheaterForScreen(null);
          }}
        />
      );
    } else if (modalType === "SEAT") {
      title = editingItem ? "Cập nhật Ghế" : "Thêm Ghế Mới";
      content = (
        <SeatForm
          key={editingItem ? `edit-${editingItem.id}` : "create-new"}
          initialData={editingItem}
          onSubmit={handleSaveSeat}
          onCancel={() => {
            setModalType(null);
            setEditingItem(null);
            setSelectedScreenForSeat(null);
          }}
        />
      );
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slideUp">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <button
              type="button"
              onClick={() => {
                setModalType(null);
                setEditingItem(null);
                setSelectedTheaterForScreen(null);
                setSelectedScreenForSeat(null);
              }}
              className="text-gray-400 hover:text-red-500 font-bold text-2xl transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50"
            >
              ×
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-gray-50 text-gray-800 font-sans p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý Rạp - Phòng - Ghế
              </h2>
              <p className="text-gray-500">
                Tổng số rạp:{" "}
                <span className="font-semibold text-indigo-600">
                  {theaterList.length}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setModalType("THEATER");
              }}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all font-semibold flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm Rạp Mới
            </button>
          </div>
        </div>

        {/* Theater List */}
        {theaterLoading && theaterList.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-500">Đang tải danh sách rạp...</p>
          </div>
        ) : theaterList.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có rạp nào
            </h3>
            <p className="text-gray-500 mb-6">
              Hãy thêm rạp đầu tiên để bắt đầu quản lý
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setModalType("THEATER");
              }}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition-all"
            >
              + Thêm Rạp Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {theaterList.map((theater) => {
              const isExpanded = expandedTheaters.has(theater.id);
              const screens = getScreensForTheater(theater.id);

              return (
                <div
                  key={theater.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  {/* Theater Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleTheater(theater.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                          🎬
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {theater.name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {theater.location}
                            </span>
                            {theater.phone && (
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                {theater.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingItem(theater);
                            setModalType("THEATER");
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                          title="Sửa"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTheater(theater.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                          title="Xóa"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTheaterForScreen(theater);
                            setEditingItem(null);
                            setModalType("SCREEN");
                          }}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Thêm Phòng
                        </button>
                        <svg
                          className={`w-6 h-6 text-gray-400 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Screens List (Expanded) */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      {screenLoading ? (
                        <div className="p-8 text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-200 border-t-green-600"></div>
                          <p className="mt-2 text-sm text-gray-500">
                            Đang tải phòng chiếu...
                          </p>
                        </div>
                      ) : screens.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-4xl mb-2">📺</div>
                          <p className="text-gray-500 mb-4">
                            Chưa có phòng chiếu nào
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTheaterForScreen(theater);
                              setEditingItem(null);
                              setModalType("SCREEN");
                            }}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            + Thêm Phòng Đầu Tiên
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 space-y-3">
                          {screens.map((screen) => {
                            const isScreenExpanded = expandedScreens.has(
                              screen.id
                            );
                            const seats = getSeatsForScreen(screen.id);

                            return (
                              <div
                                key={screen.id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                              >
                                {/* Screen Header */}
                                <div
                                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                  onClick={() => toggleScreen(screen.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                                        🎥
                                      </div>
                                      <div>
                                        <h4 className="text-lg font-bold text-gray-800">
                                          {screen.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                          Sức chứa: {screen.seat_capacity} ghế
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingItem(screen);
                                          setSelectedTheaterForScreen(theater);
                                          setModalType("SCREEN");
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                                        title="Sửa"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteScreen(screen.id);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                                        title="Xóa"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedScreenForSeat(screen);
                                          setEditingItem(null);
                                          setModalType("SEAT");
                                        }}
                                        className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                                      >
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4v16m8-8H4"
                                          />
                                        </svg>
                                        Thêm Ghế
                                      </button>
                                      <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform ${
                                          isScreenExpanded ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>

                                {/* Seats Grid (Expanded) */}
                                {isScreenExpanded && (
                                  <div className="border-t border-gray-200 bg-gray-50/30 p-4">
                                    {seatLoading ? (
                                      <div className="text-center py-4">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-purple-200 border-t-purple-600"></div>
                                        <p className="mt-2 text-xs text-gray-500">
                                          Đang tải ghế...
                                        </p>
                                      </div>
                                    ) : seats.length === 0 ? (
                                      <div className="text-center py-4">
                                        <div className="text-3xl mb-2">💺</div>
                                        <p className="text-sm text-gray-500 mb-3">
                                          Chưa có ghế nào
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedScreenForSeat(screen);
                                            setEditingItem(null);
                                            setModalType("SEAT");
                                          }}
                                          className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-colors"
                                        >
                                          + Thêm Ghế Đầu Tiên
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        <div className="text-xs text-gray-600 mb-2">
                                          Tổng: {seats.length} ghế
                                        </div>
                                        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
                                          {seats.map((seat) => (
                                            <div
                                              key={seat.id}
                                              className={`relative group border-2 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-110 ${getSeatColor(
                                                seat.type
                                              )}`}
                                            >
                                              <span className="font-bold text-xs">
                                                {seat.seat_number}
                                              </span>
                                              <span className="text-[8px] uppercase opacity-70 mt-0.5">
                                                {seat.type === "STANDARD"
                                                  ? "T"
                                                  : seat.type === "VIP"
                                                  ? "V"
                                                  : "S"}
                                              </span>
                                              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm hidden group-hover:flex items-center justify-center gap-1 rounded-lg">
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingItem(seat);
                                                    setSelectedScreenForSeat(
                                                      screen
                                                    );
                                                    setModalType("SEAT");
                                                  }}
                                                  className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded text-xs"
                                                  title="Sửa"
                                                >
                                                  ✏️
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteSeat(seat.id);
                                                  }}
                                                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs"
                                                  title="Xóa"
                                                >
                                                  🗑️
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSelectedScreenForSeat(screen);
                                              setEditingItem(null);
                                              setModalType("SEAT");
                                            }}
                                            className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-500 hover:border-purple-400 transition-all h-16"
                                          >
                                            <svg
                                              className="w-5 h-5"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 4v16m8-8H4"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {renderModal()}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TheaterManagement;
