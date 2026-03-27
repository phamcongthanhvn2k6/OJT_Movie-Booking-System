import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useState } from "react";
import {
  createNewMovie,
  deleteMovieThunk,
  fetchMovies,
  updateMovieThunk,
} from "../../store/slices/movie.slices";
import { fetchGenres } from "../../store/slices/genre.slices";
import type { Movie, MovieType } from "../../types/movie.type";

// Giá trị mặc định cho form
const initialFormState = {
  title: "",
  description: "",
  author: "",
  image: "",
  trailer: "",
  genre: "",
  country: "",
  actors: "",
  duration: 0,
  release_date: "",
  type: "2D",
};

export default function MovieManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const movieState = useSelector((state: RootState) => state.movie);
  const genreState = useSelector((state: RootState) => state.genre);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchGenres());
  }, [dispatch]);

  const [searchMovie, setSearchMovie] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMovieId, setCurrentMovieId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchMovie(e.target.value);
  };

  const movieFilter = movieState.list.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchMovie.toLowerCase());

    const matchesGenre =
      selectedGenre === "all" ||
      (movie.genre && movie.genre.includes(selectedGenre));

    return matchesSearch && matchesGenre;
  });

  const currentMovie = movieFilter.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(movieFilter.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (movie: Movie) => {
    setIsEditing(true);
    setCurrentMovieId(movie.id);
    const formattedDate = new Date(movie.release_date)
      .toISOString()
      .split("T")[0];

    setFormData({
      title: movie.title,
      description: movie.description || "",
      author: movie.author || "",
      image: movie.image || "",
      trailer: movie.trailer || "",
      genre: movie.genre || "",
      country: movie.country || "",
      actors: movie.actors || "",
      duration: movie.duration,
      release_date: formattedDate,
      type: movie.type,
    });
    setIsModalOpen(true);
  };

  // 3. Xử lý XÓA
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phim này không?")) {
      await dispatch(deleteMovieThunk(id));
      // Nếu xóa item cuối cùng của trang, lùi về trang trước
      if (currentMovie.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      id: String(
        Math.max(...movieState.list.map((movie) => Number(movie.id))) + 1
      ),
      release_date: new Date(formData.release_date),
      type: formData.type as MovieType,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (isEditing && currentMovieId) {
      const updatePayload = {
        ...payload,
        id: currentMovieId,
        created_at: new Date(),
        updated_at: new Date(),
      };
      await dispatch(updateMovieThunk(updatePayload));
    } else {
      await dispatch(createNewMovie(payload));
    }

    // Reset và đóng modal
    dispatch(fetchMovies());
    setIsModalOpen(false);
    setCurrentMovieId(null);
    setFormData(initialFormState);
  };

  // 5. Xử lý thay đổi Input
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (Number(value) < 0 && name === "duration") {
      setFormData((prev) => ({ ...prev, [name]: 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getCurrentGenres = () => {
    if (!formData.genre) return [];
    return formData.genre.split(", ").filter((g) => g.trim() !== "");
  };

  const handleGenreChange = (genreName: string) => {
    const currentGenres = getCurrentGenres();
    let newGenres;

    if (currentGenres.includes(genreName)) {
      newGenres = currentGenres.filter((g) => g !== genreName);
    } else {
      newGenres = [...currentGenres, genreName];
    }

    setFormData({
      ...formData,
      genre: newGenres.join(", "),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800">Quản lý phim</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              value={searchMovie}
              onChange={handleSearch}
              placeholder="Tìm tên phim"
              className="border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-blue-500 w-full sm:w-64"
            />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => {
              setCurrentPage(1);
              setSelectedGenre(e.target.value);
            }}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-blue-500 bg-white"
          >
            <option value="all">Tất cả thể loại</option>
            {genreState.list.map((genre) => (
              <option key={genre.id} value={genre.genre_name}>
                {genre.genre_name}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
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
              ></path>
            </svg>
            Thêm phim
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase">
              <th className="p-4 text-center w-12">STT</th>
              <th className="p-4 w-16">ID</th>
              <th className="p-4 w-20">Poster</th>
              <th className="p-4 w-48">Tên phim</th>
              <th className="p-4 w-64">Mô tả</th>
              <th className="p-4 w-32">Đạo diễn</th>
              <th className="p-4 w-32">Diễn Viên</th>
              <th className="p-4 w-32">Thể loại</th>
              <th className="p-4 w-24">Thời lượng</th>
              <th className="p-4 w-32">Ngày chiếu</th>
              <th className="p-4 text-center w-32">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentMovie.length > 0 ? (
              currentMovie.map((movie, index) => (
                <tr
                  key={movie.id}
                  className="bg-white hover:bg-slate-50 border-b border-slate-100 text-slate-600 text-sm transition-colors"
                >
                  <td className="p-4 text-center">{index + 1}</td>
                  <td className="p-4 font-medium">#{movie.id}</td>
                  <td className="p-4">
                    <img
                      src={movie.image || "/default-poster.png"}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    {movie.title}
                  </td>
                  {/* CSS line-clamp để cắt bớt mô tả dài */}
                  <td className="p-4">
                    <p className="line-clamp-2" title={movie.description}>
                      {movie.description}
                    </p>
                  </td>
                  <td className="p-4">{movie.author}</td>
                  <td className="p-4">{movie.actors}</td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold">
                      {movie.genre}
                    </span>
                  </td>
                  <td className="p-4">{formatDuration(movie.duration)}</td>
                  <td className="p-4">{formatDate(movie.release_date)}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                        onClick={() => handleOpenEdit(movie)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
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
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-400">
                  Không tìm thấy phim nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {movieFilter.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 mt-4 rounded-b-xl">
          <span className="text-sm text-slate-500">
            Hiển thị{" "}
            <span className="font-bold text-slate-800">
              {indexOfFirstItem + 1}
            </span>{" "}
            -{" "}
            <span className="font-bold text-slate-800">
              {Math.min(indexOfLastItem, movieFilter.length)}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-bold text-slate-800">
              {movieFilter.length}
            </span>{" "}
            phim
          </span>

          <div className="flex items-center gap-1">
            {/* Nút Prev */}
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

            {/* Nút Next */}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800">
                {isEditing ? "Cập nhật phim" : "Thêm phim mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
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

            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Tên phim */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên phim <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Nhập tên phim..."
                />
              </div>

              {/* URL Hình ảnh */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Link Poster (URL)
                </label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              {/* Đạo diễn */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Đạo diễn
                </label>
                <input
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Diễn viên
                </label>
                <input
                  name="actors"
                  value={formData.actors}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Thể loại */}
              <div className="block md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Thể loại (chọn nhiều)
                </label>
                <div className="mb-3 p-2 border border-slate-200 rounded-lg min-h-[42px] flex flex-wrap gap-2 bg-slate-50">
                  {formData.genre ? (
                    getCurrentGenres().map((g) => (
                      <span
                        key={g}
                        className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold border border-indigo-200"
                      >
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm p-1">
                      Chưa chọn thể loại nào...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3 custom-scrollbar">
                  {genreState.list.map((genre) => {
                    const isSelected = getCurrentGenres().includes(
                      genre.genre_name
                    );
                    return (
                      <div
                        key={genre.id}
                        onClick={() => handleGenreChange(genre.genre_name)}
                        className={`cursor-pointer flex items-center p-2 rounded border transition-all select-none ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${
                            isSelected
                              ? "bg-indigo-500 border-indigo-500"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{genre.genre_name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thời lượng */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Thời lượng (phút)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Loại phim */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Định dạng
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                </select>
              </div>

              {/* Ngày chiếu */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày khởi chiếu
                </label>
                <input
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Mô tả */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mô tả phim
                </label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Nội dung tóm tắt..."
                />
              </div>

              {/* Buttons Action */}
              <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-200"
                >
                  {isEditing ? "Lưu thay đổi" : "Tạo phim mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
