// src/types/news.types.ts

export interface NewsPost {
  id: string;
  title: string;
  date: string;
  image: string;
  detailImage?: string;
  lead: string;
  content: string;
  details: string[];
}

// Dữ liệu mẫu: Tổng hợp từ cả danh sách và chi tiết
const newsData: NewsPost[] = [
  {
    id: '1',
    title: 'Chương trình phim kỉ niệm nhân dịp 70 năm Giải phòng Thủ đô',
    image: './pic1.png',
    detailImage:'/pic1Detail.jpg',
    date: '03/10/2024',
    lead: 'Nhân dịp 70 năm ngày Giải phóng Thủ đô (10/10/1954 – 10/10/2024), Trung tâm Chiếu phim Quốc gia tổ chức chương trình phim kỉ niệm tại Trung tâm.',
    content: 'Bộ phim được chọn để trình chiếu miễn phí trong chương trình lần này là: "Đào, Phở và Piano". Tác phẩm tái hiện khung cảnh Hà Nội những ngày cuối cùng trong Trận Hà Nội 1946 và vào cuộc chiến tranh chống thực dân Pháp, những người sống sót sau chiến tranh.',
    details: [
      'Thời gian chiếu phim: từ 04/10/2024',
      'Địa điểm: Phòng chiếu số 12',
      'Suất chiếu: 10h00 và 20h15',
      'Hình thức nhận vé: Khách hàng nhận vé ở đúng trực tiếp tại quầy vé'
    ]
  },
  {
    id: '2',
    title: 'VUI TẾT TRUNG THU - RINH QUÀ VI VU',
    image: '/pic2.png',
    date: '20/12/2025',
    lead: 'Chương trình khuyến mãi đặc biệt nhân dịp Tết Trung Thu, mang đến những ưu đãi hấp dẫn cho khách hàng.',
    content: 'Nhân dịp Tết Trung Thu, NCC Cinema tri ân khách hàng với chương trình khuyến mãi đặc biệt. Đây là cơ hội tuyệt vời để cả gia đình cùng nhau thưởng thức những bộ phim hay và nhận về những phần quà giá trị.',
    details: [
      'Thời gian: Từ 15/09 đến 30/09/2024',
      'Ưu đãi: Giảm 30% cho vé xem phim',
      'Quà tặng: Lồng đèn và bánh trung thu cho khách hàng may mắn'
    ]
  },
  {
    id: '3',
    title: 'Chương trình "Suất chiếu đặc biệt" lần đầu tiên diễn ra tại Trung tâm Chiếu phim Quốc gia',
    image: '/pic3.png',
    date: '19/12/2025',
    lead: 'Trung tâm Chiếu phim Quốc gia vinh dự giới thiệu chương trình "Suất chiếu đặc biệt" lần đầu tiên với nhiều hoạt động hấp dẫn.',
    content: 'Chương trình "Suất chiếu đặc biệt" là sáng kiến mới nhằm mang đến trải nghiệm điện ảnh độc đáo cho khán giả. Các bộ phim được tuyển chọn kỹ lưỡng, kết hợp với nhiều hoạt động tương tác thú vị.',
    details: [
      'Thời gian: Mỗi tháng 1 suất chiếu',
      'Phim: Các tác phẩm điện ảnh đặc sắc',
      'Hoạt động: Giao lưu với đạo diễn, diễn viên'
    ]
  },
  {
    id: '4',
    title: 'SUẤT CHIẾU ĐẶC BIỆT - QUÀ TẶNG TƯNG BỪNG - GIÁ VÉ KHÔNG ĐỔI',
    image: '/pic4.png',
    date: '18/12/2025',
    lead: 'Chương trình suất chiếu đặc biệt với quà tặng giá trị, giá vé không thay đổi cho tất cả khách hàng.',
    content: 'NCC Cinema mang đến chương trình suất chiếu đặc biệt với nhiều ưu đãi hấp dẫn. Khách hàng không chỉ được thưởng thức phim hay mà còn nhận về những món quà giá trị, tất cả với mức giá vé không đổi.',
    details: [
      'Thời gian: Cuối tuần hàng tuần',
      'Quà tặng: Combo bắp nước, poster phim',
      'Giá vé: Giữ nguyên giá thường'
    ]
  },
  {
    id: '5',
    title: 'Đợt phim Kỷ niệm 79 năm Cách mạng tháng 8 (19/8/1945-19/8/2024) và Quốc Khánh nước Cộng hòa xã hội chủ nghĩa Việt Nam (2/9/1945- 2/9/2024) tại Trung tâm Chiếu phim Quốc gia',
    image: '/pic5.png',
    date: '17/12/2025',
    lead: 'Chương trình chiếu phim đặc biệt kỷ niệm 79 năm Cách mạng tháng 8 và Quốc Khánh nước Cộng hòa xã hội chủ nghĩa Việt Nam.',
    content: 'Nhân dịp kỷ niệm 79 năm Cách mạng tháng 8 và Quốc Khánh, Trung tâm Chiếu phim Quốc gia tổ chức đợt chiếu phim với các tác phẩm về lịch sử dân tộc, góp phần giáo dục truyền thống yêu nước cho thế hệ trẻ.',
    details: [
      'Thời gian: Từ 19/8 đến 2/9/2024',
      'Nội dung: Các phim tài liệu và điện ảnh về lịch sử',
      'Đối tượng: Miễn phí cho học sinh, sinh viên'
    ]
  },
  {
    id: '6',
    title: 'Tuyển dụng cộng tác viên soát vé dẫn chỗ, bán vé tại Trung tâm Chiếu phim Quốc gia',
    image: '/pic6.png',
    date: '16/12/2025',
    lead: 'Chương trình khuyến mãi khủng cuối năm với mức giảm giá lên đến 50% cho tất cả các suất chiếu.',
    content: 'Kết thúc một năm thành công, NCC Cinema tri ân khách hàng với chương trình khuyến mãi lớn nhất trong năm. Giảm giá 50% cho tất cả các loại vé, áp dụng cho mọi suất chiếu trong thời gian diễn ra chương trình.',
    details: [
      'Thời gian: Từ 15/12 đến 31/12/2024',
      'Giảm giá: 50% tất cả loại vé',
      'Áp dụng: Tất cả suất chiếu, không giới hạn'
    ]
  },
  {
    id: '7',
    title: 'THÔNG BÁO HOÀN THÀNH KHẢO SÁT CƠ SỞ VẬT CHẤT NĂM 2024',
    image: '/pic7.png',
    date: '15/12/2025',
    lead: 'NCC Cinema công bố kế hoạch mở rộng mạng lưới rạp chiếu phim tại khu vực miền Nam.',
    content: 'Trong năm 2025, NCC Cinema sẽ triển khai mở thêm 5 cụm rạp mới tại các tỉnh thành miền Nam. Đây là bước đi chiến lược nhằm phục vụ nhu cầu giải trí ngày càng tăng của người dân và khẳng định vị thế của NCC Cinema trên thị trường.',
    details: [
      'Thời gian: Quý 1-2/2025',
      'Địa điểm: TP.HCM, Cần Thơ, Vũng Tàu',
      'Quy mô: Mỗi cụm rạp 6-8 phòng chiếu'
    ]
  },
  {
    id: '8',
    title: 'REVIEW PHIM HOẠT HÌNH HOT NHẤT HÈ NÀY - KẺ TRỘM MẶT TRĂNG 4',
    image: '/pic8.png',
    date: '14/12/2025',
    lead: 'Chương trình suất chiếu sớm với mức giá ưu đãi chỉ 69K/vé, dành cho khách hàng yêu thích xem phim vào buổi sáng.',
    content: 'Đặc biệt dành cho những người thích không gian rạp yên tĩnh vào buổi sáng, NCC Cinema giới thiệu chương trình Suất Chiếu Sớm với mức giá cực kỳ hấp dẫn chỉ 69K/vé. Thưởng thức phim trong không gian thoải mái, ít đông đúc.',
    details: [
      'Thời gian: Các ngày trong tuần (Thứ 2 - Thứ 6)',
      'Khung giờ: Trước 12h trưa',
      'Giá vé: 69,000 VNĐ/vé (tất cả loại ghế)'
    ]
  },
  // Các bài viết từ 9-24 (Giữ lại để phân trang hoạt động, thêm nội dung mặc định)
  ...Array.from({ length: 16 }, (_, i) => ({
    id: (i + 9).toString(),
    title: `Tin tức mẫu số ${i + 9}: Sự kiện điện ảnh hấp dẫn`,
    image: `https://images.unsplash.com/photo-${[
      '1509281373149-e957c6296406', '1511632765486-a01980e01a18', '1594908900066-3f47337549d8', '1513106580091-1d82408b8cd6'
    ][i % 4]}?w=600&h=400&fit=crop`,
    date: `${13 - i}/12/2025`,
    lead: 'Nội dung tóm tắt đang được cập nhật cho bài viết này...',
    content: 'Nội dung chi tiết của bài viết đang được biên tập và sẽ sớm ra mắt quý độc giả. Vui lòng quay lại sau.',
    details: ['Trạng thái: Đang cập nhật', 'Liên hệ: Ban quản trị']
  }))
];

export const getNewsList = (): NewsPost[] => newsData;
export const getNewsById = (id: string): NewsPost | undefined => newsData.find((p) => p.id === id);