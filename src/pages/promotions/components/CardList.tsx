import { useState } from "react";
import { PromotionCard } from "./PromotionCard";

type Promotion = {
  image: string;
  date: string;
  title: string;
};

type CardListProps = {
  data: Promotion[];
};

const PAGE_SIZE = 8;

const CardList = ({ data }: CardListProps) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const currentData = data.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 w-full p-2">
      {/* Grid */}
      <div
        className="
            w-full
            max-w-none       
            grid gap-6
            grid-cols-1       /* mobile */
            md:grid-cols-1    /* tablet full */
            lg:grid-cols-4    /* desktop */
        "
      >
        {currentData.map((item, index) => (
          <PromotionCard
            key={index}
            image={item.image}
            date={item.date}
            title={item.title}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="hidden lg:flex gap-4 text-sm self-end">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded border bg-gray-900
            ${
              page === 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-700 cursor-pointer"
            }`}
        >
          Quay lại
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded border borderbg-gray-900 bg-gray-900
            ${
              page === totalPages
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-700 cursor-pointer"
            }`}
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default CardList;
