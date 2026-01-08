import type { Movie } from "../../../types/movie.type";

interface BannerProps {
  currentMovie: Movie;
  openTrailer: ()=>void
}

export const Banner = ({ currentMovie, openTrailer }: BannerProps) => {
  return (
    <>
      <div
        className="relative bg-cover bg-center w-full h-[473px] font-[Montserrat]"
        style={{ backgroundImage: `url(${currentMovie.image})` }}
      >
        {/* lớp phủ gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900 to-gray-900 lg:opacity-80 opacity-900"></div>

        {/* lớp phủ mờ */}
        <div className="absolute inset-0 bg-gray-900 opacity-50"></div>

        {/* nội dung bên trong */}

        <div
          className="absolute top-1/2 left-1/2 
                  -translate-x-1/2 -translate-y-1/2
                  z-10 text-white
                  
                  gap-4 md:gap-6 lg:gap-10
                  w-[90%] md:w-[700px] lg:w-[896px] items-center"
        >
          <div className="flex gap-3">
          {/* Hình ảnh phim */}
          <img
            src={currentMovie.image}
            alt={currentMovie.title}
            className="rounded-[12px] lg:w-[238px] lg:h-[333px] md:w-[200px] md:h-[250px] w-[150px] h-[200px]"
          />

          {/* Nội dung phim */}
          
            <div className="lg:h-[333px] flex flex-col self-center">
              <div>
                {/* Tiêu đề + loại phim(2/3D)*/}
                <div className="flex items-center gap-2">
                  <p className="font-bold lg:text-2xl md:text-[20px] text-[16px] leading-8 text-white">
                    {currentMovie.title.toUpperCase()}
                  </p>
                  <span
                    className="border border-gray-300 rounded-[12px] text-[14px] w-[38px] h-[38px] 
                       flex items-center justify-center"
                  >
                    {currentMovie.type}
                  </span>
                </div>

                {/* Tiêu đề + loại phim(2/3D) + thể loại */}
                <div
                  className="
                          flex flex-wrap items-center
                          gap-x-2
                          text-[14px] md:text-[16px] lg:text-[14px] leading-[20px] font-[400] text-white
                        "
                >
                  <p>{currentMovie.genre}</p>

                  <span className="opacity-60 lg:hidden">-</span>

                  <p>{currentMovie.country}</p>

                  <span className="opacity-60 lg:hidden">-</span>

                  <p>{currentMovie.duration} phút</p>

                  {/* Desktop mới hiện */}
                  <p className="hidden lg:block">
                    Đạo diễn: {currentMovie.author}
                  </p>
                </div>
              </div>

              {/* Thông tin chi tiết destop */}
              <div className="hidden lg:flex flex-col justify-between h-full">
                <div>
                  <p className="text-[14px] leading-[20px] font-[400] text-white">
                    Diễn viên: {currentMovie.actors}
                  </p>
                </div>

                <p className="text-[14px] leading-[20px] font-[400] text-white max-h-[60px] overflow-y-auto">
                  {currentMovie.description}
                </p>

                <p className="text-[14px] leading-[20px] font-[400] text-red-700">
                  Kiểm duyệt: không
                </p>

                <div className="flex justify-center md:justify-start gap-4 items-center">
                  <a className="text-sm underline underline-offset-6 hover:cursor-pointer hover:text-gray-400">
                    Chi tiết nội dung
                  </a>
                  <button className="border border-[#EAB308] text-[#EAB308] py-[9px] px-[41px] rounded-full hover:bg-[#EAB308] hover:text-white hover:cursor-pointer"
                    onClick={openTrailer}
                  >
                    Xem trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* mô tả table-mb */}
          <div className="mt-2 lg:hidden flex-col justify-between h-full">
            <div>
              <p className="text-[14px] leading-[20px] font-[400] text-white">
                Diễn viên: {currentMovie.actors}
              </p>
            </div>

            <p className="text-[14px] leading-[20px] font-[400] text-white max-h-[60px] overflow-y-auto">
              {currentMovie.description}
            </p>

            <p className="text-[14px] leading-[20px] font-[400] text-red-700">
              Kiểm duyệt: không
            </p>

            <div className="flex gap-4 items-center justify-center">
              <a className="text-sm underline underline-offset-6">
                Chi tiết nội dung
              </a>
              <button className="border border-[#EAB308] text-[#EAB308] py-[9px] px-[41px] rounded-full hover:bg-[#EAB308] hover:text-white"
                onClick={openTrailer}
              >
                Xem trailer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
