import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CardList from "./components/CardList";
import type { PromotionType } from "../../types/promotion.type";
import { useEffect, useState } from "react";

export const Promotion = () => {
  const [data, setData] = useState<PromotionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch("https://your-api.com/promotions");
//         if (!res.ok) throw new Error("Fetch failed");

//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         setError("Không tải được danh sách khuyến mãi");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPromotions();
//   }, []);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
//         Đang tải...
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="min-h-screen bg-gray-900 text-red-500 flex justify-center items-center">
//         {error}
//       </main>
//     );
//   }

const mockPromotions: PromotionType[] = [
  {
    id: 1,
    image: "https://picsum.photos/300/180?random=1",
    date: "01/08/2024",
    title: "Ưu đãi bắp rang vị phô mai – Giá không đổi",
  },
  {
    id: 2,
    image: "https://picsum.photos/300/180?random=16",
    date: "02/08/2024",
    title: "Combo nước ngọt – Mua 2 tặng 1",
  },
  {
    id: 3,
    image: "https://picsum.photos/300/180?random=3",
    date: "03/08/2024",
    title: "Giảm giá vé xem phim cho sinh viên",
  },
  {
    id: 4,
    image: "https://picsum.photos/300/180?random=4",
    date: "04/08/2024",
    title: "Khuyến mãi cuối tuần – Vé đồng giá",
  },
  {
    id: 5,
    image: "https://picsum.photos/300/180?random=5",
    date: "05/08/2024",
    title: "Ra mắt combo gia đình tiết kiệm",
  },
  {
    id: 6,
    image: "https://picsum.photos/300/180?random=6",
    date: "06/08/2024",
    title: "Ưu đãi đặc biệt cho thành viên VIP",
  },
  {
    id: 7,
    image: "https://picsum.photos/300/180?random=7",
    date: "07/08/2024",
    title: "Giảm 30% bắp nước khi mua vé online",
  },
  {
    id: 8,
    image: "https://picsum.photos/300/180?random=8",
    date: "08/08/2024",
    title: "Thứ 4 vui vẻ – Vé xem phim ưu đãi",
  },
  {
    id: 9,
    image: "https://picsum.photos/300/180?random=9",
    date: "09/08/2024",
    title: "Mua vé sớm – Chọn ghế đẹp",
  },
  {
    id: 10,
    image: "https://picsum.photos/300/180?random=10",
    date: "10/08/2024",
    title: "Combo đôi – Tiết kiệm hơn",
  },
  {
    id: 11,
    image: "https://picsum.photos/300/180?random=11",
    date: "11/08/2024",
    title: "Ưu đãi sinh nhật – Quà tặng bất ngờ",
  },
  {
    id: 12,
    image: "https://picsum.photos/300/180?random=12",
    date: "12/08/2024",
    title: "Xem phim khuya – Giá siêu rẻ",
  },
  {
    id: 13,
    image: "https://picsum.photos/300/180?random=13",
    date: "13/08/2024",
    title: "Khuyến mãi phim bom tấn tháng 8",
  },
  {
    id: 14,
    image: "https://picsum.photos/300/180?random=14",
    date: "14/08/2024",
    title: "Ưu đãi học sinh – sinh viên",
  },
  {
    id: 15,
    image: "https://picsum.photos/300/180?random=15",
    date: "15/08/2024",
    title: "Giảm giá combo bắp caramel",
  },
  {
    id: 16,
    image: "https://picsum.photos/300/180?random=16",
    date: "16/08/2024",
    title: "Ưu đãi cuối tháng – Đừng bỏ lỡ",
  },
];

  return (
    <div className=" bg-gray-900 text-white min-h-screen w-full">
    <div className="w-full max-w-[1440px] mx-auto px-4">
      <Header />

      <main className="flex flex-col">
        <p className="text-center font-montserrat font-bold text-[24px] leading-8 tracking-normal text-center mt-[48px] mb-[48px]">
          Khuyến mãi
        </p>

        <CardList data={mockPromotions} />
      </main>

      <Footer />
    </div>
    </div>
  );
};
