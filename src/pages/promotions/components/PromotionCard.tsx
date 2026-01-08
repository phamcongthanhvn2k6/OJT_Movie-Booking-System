type CardProps = {
  image: string;
  date: string;
  title: string;
};

export const PromotionCard = ({ image, date, title }: CardProps) => {
  return (
    <div
      className="bg-gray-900 border border-gray-700 rounded-lg
      overflow-hidden hover:scale-[1.02] transition
      h-full flex flex-col"
    >
      <div className="w-full h-[210px] overflow-hidden bg-gray-800">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="p-3 flex-1 ">
        <p className="text-xs text-gray-400 m-0">{date}</p>
        <p className="text-[16px] font-montserrat font-bold mt-1 leading-6 line-clamp-2">
          {title}
        </p>
      </div>
    </div>
  );
};
