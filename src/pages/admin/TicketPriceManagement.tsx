import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import type { DayType, TicketPrice } from "../../types/ticketPrice.type";
import type { SeatType } from "../../types/seat.type";
import type { MovieType } from "../../types/movie.type";
import {
  createTicketPrice,
  deleteTicketPriceThunk,
  fetchTicketPrices,
  updateTicketPriceThunk,
} from "../../store/slices/ticketPrice.slices";

export default function TicketPriceManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: prices, loading } = useSelector(
    (state: RootState) => state.ticketPrice
  );

  // --- LOCAL STATE ---
  const [filterMovie, setFilterMovie] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TicketPrice | null>(null);

  // Form State
  const initialForm = {
    type_seat: "STANDARD" as SeatType,
    type_movie: "2D" as MovieType,
    day_type: 0 as DayType,
    price: 0,
    start_time: "",
    end_time: "",
  };
  const [formData, setFormData] = useState(initialForm);

  // --- FETCH DATA ---
  useEffect(() => {
    dispatch(fetchTicketPrices());
  }, [dispatch]);

  // --- FILTER LOGIC ---
  const filteredPrices = prices.filter(
    (p) => filterMovie === "all" || p.type_movie === filterMovie
  );

  // --- HELPERS ---
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDayTypeName = (type: number) =>
    type === 1 ? "Cuối tuần / Lễ" : "Ngày thường";

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setEditingItem(null);
    const now = new Date();
    const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59);

    setFormData({
      ...initialForm,
      price: 50000,
      start_time: formatDate(now.toISOString()),
      end_time: formatDate(endOfYear.toISOString()),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TicketPrice) => {
    setEditingItem(item);
    setFormData({
      type_seat: item.type_seat,
      type_movie: item.type_movie,
      day_type: item.day_type,
      price: item.price,
      start_time: formatDate(item.start_time),
      end_time: formatDate(item.end_time),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert input time back to ISO string
    const payload = {
      ...formData,
      start_time: new Date(formData.start_time),
      end_time: new Date(formData.end_time),
    };

    if (editingItem) {
      // Update
      await dispatch(
        updateTicketPriceThunk({ ...payload, id: editingItem.id })
      );
    } else {
      // Create
      await dispatch(createTicketPrice({ ...payload }));
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa cấu hình giá này?")) {
      await dispatch(deleteTicketPriceThunk(id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Giá Vé</h2>
          <p className="text-sm text-slate-500">
            Cấu hình bảng giá cho từng loại ghế và thời điểm.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterMovie}
            onChange={(e) => setFilterMovie(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-indigo-500"
          >
            <option value="all">Tất cả phim</option>
            <option value="2D">Phim 2D</option>
            <option value="3D">Phim 3D</option>
          </select>
          <button
            onClick={handleOpenCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            + Thêm Giá Mới
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase">
            <tr>
              <th className="p-4 w-20">ID</th>
              <th className="p-4">Cấu hình Vé</th>
              <th className="p-4">Loại ngày</th>
              <th className="p-4 w-32">Giá vé</th>
              <th className="p-4 w-48">Hiệu lực từ</th>
              <th className="p-4 w-48">Đến ngày</th>
              <th className="p-4 w-24 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : (
              filteredPrices.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 text-slate-500">#{item.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.type_movie === "3D"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.type_movie}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.type_seat === "VIP"
                            ? "bg-amber-100 text-amber-700"
                            : item.type_seat === "SWEETBOX"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.type_seat}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 font-medium">
                    {getDayTypeName(item.day_type)}
                  </td>
                  <td className="p-4 text-emerald-600 font-bold text-base">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="p-4 text-slate-500 text-xs">
                    {new Date(item.start_time).toLocaleString("en-GB")}
                  </td>
                  <td className="p-4 text-slate-500 text-xs">
                    {new Date(item.end_time).toLocaleString("en-GB")}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                {editingItem ? "Cập nhật Giá Vé" : "Thêm Giá Vé Mới"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Loại Phim
                  </label>
                  <select
                    value={formData.type_movie}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type_movie: e.target.value as MovieType,
                      })
                    }
                    className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Loại Ghế
                  </label>
                  <select
                    value={formData.type_seat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type_seat: e.target.value as SeatType,
                      })
                    }
                    className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="STANDARD">STANDARD</option>
                    <option value="VIP">VIP</option>
                    <option value="SWEETBOX">SWEETBOX</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Loại Ngày
                  </label>
                  <select
                    value={formData.day_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        day_type: Number(e.target.value) as DayType,
                      })
                    }
                    className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value={0}>Ngày thường (T2-T6)</option>
                    <option value={1}>Cuối tuần / Lễ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Giá vé (VND)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-emerald-600"
                  />
                </div>
              </div>

              {/* THỜI GIAN HIỆU LỰC */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3">
                <p className="text-xs font-bold text-indigo-900 uppercase">
                  Thời gian hiệu lực (Start - End)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">
                      Bắt đầu
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.start_time}
                      onChange={(e) =>
                        setFormData({ ...formData, start_time: e.target.value })
                      }
                      className="w-full border rounded p-1.5 text-xs focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">
                      Kết thúc (Có thể sửa)
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.end_time}
                      onChange={(e) =>
                        setFormData({ ...formData, end_time: e.target.value })
                      }
                      className="w-full border rounded p-1.5 text-xs focus:border-indigo-500 outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                  {editingItem ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
