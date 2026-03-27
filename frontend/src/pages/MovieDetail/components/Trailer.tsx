import React from "react";

interface TrailerProps {
  trailerLink: string | undefined;
  onClose: () => void; // hàm đóng modal
}

const TrailerModal: React.FC<TrailerProps> = ({
  trailerLink,
  onClose,
}) => {
  if (!trailerLink) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-white px-6 py-4 rounded-lg text-center">
          Không có trailer
          <button
            onClick={onClose}
            className="block mt-4 text-red-500 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Overlay click để đóng */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 w-[50vw] h-[50vh] max-w-[960px] mx-4">
        {/* Responsive iframe */}
        <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`${trailerLink}?rel=0&modestbranding=1`}
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-white hover:text-red-500 hover:scale-120 hover:cursor-pointer transition  rounded-full"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default TrailerModal;
