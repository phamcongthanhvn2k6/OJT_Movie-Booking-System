import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";

// Import Actions
import {
  fetchShowtimes,
  createNewShowtime,
  updateShowtimeThunk,
  deleteShowtimeThunk,
} from "../../store/slices/showtime.slices";
import { fetchMovies } from "../../store/slices/movie.slices";
import { fetchTheaters } from "../../store/slices/theater.slices";
import {
  fetchScreens,
  fetchScreensByTheater,
} from "../../store/slices/screen.slices";
import type { Showtime } from "../../types/showtime.type";

// Import Types & Utils

export default function ShowtimeManagement() {
  const dispatch = useDispatch<AppDispatch>();

  // --- REDUX STATE ---
  const { list: showtimes, loading } = useSelector(
    (state: RootState) => state.showtime
  );
  const { list: movies } = useSelector((state: RootState) => state.movie);
  const { list: theaters } = useSelector((state: RootState) => state.theater);
  const { list: screens } = useSelector((state: RootState) => state.screen);

  // --- LOCAL STATE ---
  const [filterDate, setFilterDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    movie_id: "",
    theater_id: "", // Dùng để filter screens, không lưu vào showtime db
    screen_id: "",
    date: "",
    start_time: "09:00",
  });

  // --- INITIAL LOAD ---
  useEffect(() => {
    dispatch(fetchShowtimes());
    dispatch(fetchMovies());
    dispatch(fetchTheaters());
    dispatch(fetchScreens());
  }, [dispatch]);

  // --- LOGIC FILTER ---
  const filteredShowtimes = showtimes.filter((item) => {
    // Chỉ hiện lịch chiếu của ngày đang chọn
    const itemDate = new Date(item.start_time).toISOString().split("T")[0];
    return itemDate === filterDate;
  });

  // --- HANDLERS ---

  // 1. Khi chọn Rạp -> Load danh sách phòng
  const handleTheaterChange = (theaterId: string) => {
    setFormData((prev) => ({ ...prev, theater_id: theaterId, screen_id: "" }));
    if (theaterId) {
      // Vì screens.Slice yêu cầu tham số là number, ta ép kiểu nếu cần
      // Nhưng nếu screens.Slice đã sửa nhận string thì bỏ Number()
      dispatch(fetchScreensByTheater(theaterId));
    }
  };

  const handleOpenCreate = () => {
    setEditingShowtime(null);
    setFormData({
      movie_id: "",
      theater_id: "",
      screen_id: "",
      date: filterDate,
      start_time: "09:00",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (showtime: Showtime) => {
    setEditingShowtime(showtime);

    // Tách ngày giờ từ start_time ISO string
    const startDate = new Date(showtime.start_time);
    const dateStr = startDate.toISOString().split("T")[0];
    const timeStr = startDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Cần tìm theater_id của screen này để load dropdown screens
    // Do cấu trúc DB showtime chỉ lưu screen_id, ta tạm thời để user chọn lại rạp
    // Hoặc nếu bạn có API lấy screen detail thì gọi ở đây.

    setFormData({
      movie_id: showtime.movie_id || "",
      theater_id: "", // User phải chọn lại rạp để load screens
      screen_id: showtime.screen_id || "",
      date: dateStr,
      start_time: timeStr,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa lịch chiếu này?")) {
      await dispatch(deleteShowtimeThunk(id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Tính toán start_time (ISO)
    const startDateTime = new Date(`${formData.date}T${formData.start_time}`);

    // 2. Tính toán end_time dựa trên duration phim
    const selectedMovie = movies.find(
      (m) => m.id.toString() === formData.movie_id
    );
    const durationMinutes = selectedMovie?.duration || 120; // Mặc định 120p nếu không có info

    const endDateTime = new Date(
      startDateTime.getTime() + durationMinutes * 60000
    );

    const payload = {
      movie_id: formData.movie_id,
      screen_id: formData.screen_id,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (editingShowtime) {
      // UPDATE
      await dispatch(
        updateShowtimeThunk({
          ...editingShowtime,
          ...payload,
          updated_at: new Date().toISOString(),
        })
      );
    } else {
      // CREATE
      //   const newId = Math.max(...showtimes.map((show) => Number(show.id)));
      await dispatch(
        createNewShowtime({
          //   id: String(newId),
          ...payload,
        })
      );
    }

    setIsModalOpen(false);
  };

  // Helper hiển thị tên phim
  const getMovieName = (id?: string) => {
    const movie = movies.find((m) => m.id.toString() === id);
    return movie ? movie.title : id;
  };

  //   const getTheaterName = (id?: string) => {
  //     const currScreen = screens.find((screen) => screen.id === id);
  //     console.log(currScreen);

  //     const theater = theaters.find(
  //       (theater) => String(theater.id) === String(currScreen?.theater_id)
  //     );
  //     console.log("Theater", theater);

  //     return theater ? theater.name : "Lỗi không tìm thấy rạp";
  //   };

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* HEADER & FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Quản lý Lịch chiếu
          </h2>
          <p className="text-sm text-slate-500">
            Xem và sắp xếp lịch chiếu theo ngày.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-indigo-500"
          />
          <button
            onClick={handleOpenCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
          >
            + Tạo Lịch
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase">
            <tr>
              <th className="p-4 w-20">ID</th>
              <th className="p-4 w-64">Phim</th>
              <th className="p-4">Phòng chiếu (Screen)</th>
              <th className="p-4 w-32">Bắt đầu</th>
              <th className="p-4 w-32">Kết thúc</th>
              <th className="p-4 w-24 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredShowtimes.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Không có lịch chiếu nào trong ngày này.
                </td>
              </tr>
            ) : (
              filteredShowtimes.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-600">#{item.id}</td>
                  <td className="p-4 font-bold text-slate-800">
                    {getMovieName(item.movie_id)}
                  </td>
                  <td className="p-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold border border-indigo-100">
                      Screen {item.screen_id}
                      {/* {getTheaterName(item.screen_id)} */}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-emerald-600">
                    {formatDate(item.start_time)}
                  </td>
                  <td className="p-4 text-slate-500">
                    {formatDate(item.end_time)}
                  </td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Sửa"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Xóa"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                {editingShowtime ? "Cập nhật Lịch chiếu" : "Tạo Lịch chiếu Mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* 1. Chọn Phim */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Phim <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.movie_id}
                  onChange={(e) =>
                    setFormData({ ...formData, movie_id: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Chọn Phim --</option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} - {m.duration} phút
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Chọn Rạp & Phòng (Cascading) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Rạp
                  </label>
                  <select
                    value={formData.theater_id}
                    onChange={(e) => handleTheaterChange(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">-- Chọn Rạp --</option>
                    {theaters.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Phòng chiếu
                  </label>
                  <select
                    required
                    disabled={!formData.theater_id}
                    value={formData.screen_id}
                    onChange={(e) =>
                      setFormData({ ...formData, screen_id: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100"
                  >
                    <option value="">-- Chọn Phòng --</option>
                    {screens.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.seat_capacity} ghế)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Ngày & Giờ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Ngày chiếu
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Giờ bắt đầu
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex gap-2">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>
                  Giờ kết thúc sẽ được tính tự động dựa trên thời lượng phim.
                  Hãy đảm bảo không xếp lịch trùng giờ trong cùng một phòng.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                  {editingShowtime ? "Cập nhật" : "Tạo Lịch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
